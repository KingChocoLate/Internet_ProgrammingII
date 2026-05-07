import { Module } from '@nestjs/common';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

import { CategoriesModule } from '../category/category.module';
import { ProductsModule } from '../product/product.module';

@Module({
  imports: [CategoriesModule, ProductsModule],
  providers: [
    // LAB NOTE: Part A schema-first resolver files are kept, but Part B registers code-first resolvers.
    CategoryCodeFirstResolver,
    ProductCodeFirstResolver,
  ],
})
export class GraphqlModule {}
