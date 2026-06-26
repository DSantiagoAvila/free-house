import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { generateSlug } from '../../config/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { parentId: null },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category not found: ${slug}`);
    }

    return category;
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category not found: ${id}`);
    }

    return category;
  }

  async create(name: string, description?: string, parentId?: number): Promise<Category> {
    const slug = generateSlug(name);
    const existing = await this.categoryRepo.findOne({ where: { slug } });

    if (existing) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    const category = this.categoryRepo.create({ name, slug, description, parentId });
    return this.categoryRepo.save(category);
  }
}
