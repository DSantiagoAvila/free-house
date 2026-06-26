import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return { data: categories, message: 'Categories retrieved successfully' };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const category = await this.categoriesService.findBySlug(slug);
    return { data: category, message: 'Category retrieved successfully' };
  }
}
