import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: QueryProductsDto) {
    const result = await this.productsService.findAll(query);
    return { data: result, message: 'Products retrieved successfully' };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return { data: product, message: 'Product retrieved successfully' };
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return { data: product, message: 'Product created successfully' };
  }

  @Patch(':id/variants/:variantId/stock')
  async updateStock(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const variant = await this.productsService.updateStock(variantId, quantity);
    return { data: variant, message: 'Stock updated successfully' };
  }
}
