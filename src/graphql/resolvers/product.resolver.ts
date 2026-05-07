import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductsService } from '../../product/product.service';
import { CategoriesService } from '../../category/category.service';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private readonly productService: ProductsService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Query('products')
  products() {
    return this.productService.findAll();
  }

  @Query('product')
  product(@Args('id') id: string) {
    // GraphQL ID comes as string; convert if needed
    return this.productService.findOne(Number(id));
  }

  @Mutation('createProduct')
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.create({
      name,
      price,
      categoryId: Number(categoryId),
    } as any);
  }

  // ✅ relation: Product.category
  @ResolveField('category')
  category(@Parent() product: any) {
    return this.categoryService.findOne(product.categoryId);
  }
}
