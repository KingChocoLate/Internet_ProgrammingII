import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from '../../category/category.service';

@Resolver('Category') // <-- matches schema type name
export class CategoryResolver {
  constructor(private readonly categoryService: CategoriesService) {}

  @Query('categories') // <-- matches schema query name
  categories() {
    return this.categoryService.findAll(); // you already have (or students implement)
  }

  @Mutation('createCategory')
  createCategory(@Args('name') name: string) {
    // LAB NOTE: Existing REST DTO has extra required fields, but the lab mutation only sends name.
    return this.categoryService.create({ name } as any);
  }
}
