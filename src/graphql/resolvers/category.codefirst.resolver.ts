import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryType } from '../types/category.type';
import { CategoriesService } from '../../category/category.service';

@Resolver(() => CategoryType)
export class CategoryCodeFirstResolver {
  // LAB NOTE: Your existing service is named CategoriesService, not CategoryService.
  constructor(private readonly categoryService: CategoriesService) {}

  @Query(() => [CategoryType])
  categories() {
    return this.categoryService.findAll();
  }

  @Mutation(() => CategoryType)
  createCategory(@Args('name') name: string) {
    // LAB NOTE: Existing REST DTO has extra required fields, but the lab mutation only sends name.
    return this.categoryService.create({ name } as any);
  }
}
