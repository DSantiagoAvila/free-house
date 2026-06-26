import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { ProductVariant, InventoryStatus } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { paginate, PaginatedResult } from '../../common/dto/pagination.dto';
import { generateSlug } from '../../config/slug.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedResult<Product>> {
    const { page, limit, category, status, search, categoryId, gender } = query;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.status = :status', { status: status ?? ProductStatus.ACTIVE });

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (category) {
      qb.andWhere('category.slug = :category', { category });
    }

    if (gender) {
      qb.andWhere('product.gender = :gender', { gender });
    }

    if (search) {
      qb.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return paginate(items, total, page, limit);
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug, status: ProductStatus.ACTIVE },
      relations: ['category', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product not found: ${slug}`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = await this.generateUniqueSlug(dto.name);

    const product = this.productRepo.create({
      ...dto,
      slug,
    });

    if (product.variants) {
      product.variants = product.variants.map((v) => {
        const variant = new ProductVariant();
        Object.assign(variant, v);
        variant.inventoryStatus = variant.computeInventoryStatus();
        return variant;
      });
    }

    try {
      return await this.productRepo.save(product);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('A product with this SKU or slug already exists');
      }
      throw err;
    }
  }

  async updateStock(variantId: number, quantity: number): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOneBy({ id: variantId });

    if (!variant) {
      throw new NotFoundException(`Variant not found: ${variantId}`);
    }

    variant.stockQuantity = quantity;
    variant.inventoryStatus = variant.computeInventoryStatus();

    return this.variantRepo.save(variant);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = generateSlug(name);
    const existing = await this.productRepo.findOne({ where: { slug: base } });

    if (!existing) return base;

    const { nanoid } = await import('nanoid');
    return `${base}-${nanoid(4)}`;
  }
}
