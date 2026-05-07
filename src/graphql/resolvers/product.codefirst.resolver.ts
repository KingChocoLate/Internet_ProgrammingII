import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductType } from '../types/product.type';
import { CreateProductInput } from '../inputs/create-product.input';
import { ProductsService } from '../../product/product.service';
import { CategoriesService } from '../../category/category.service';
import { CategoryType } from '../types/category.type';

@Resolver(() => ProductType)
export class ProductCodeFirstResolver {
  // LAB NOTE: Your existing services are plural: ProductsService and CategoriesService.
  constructor(
    private readonly productService: ProductsService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Query(() => [ProductType])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductType, { nullable: true })
  product(@Args('id', { type: () => ID }) id: number) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductType)
  createProduct(@Args('input') input: CreateProductInput) {
    // LAB NOTE: Existing REST DTO has more required fields than the lab GraphQL input.
    return this.productService.create(input as any);
  }

  @ResolveField(() => CategoryType, { nullable: true })
  category(@Parent() product: ProductType) {
    return this.categoryService.findOne(product.categoryId);
  }
}
