import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './category/category.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { ProductsModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // LAB NOTE: Part A used schema-first with typePaths.
      // typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')],
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
    }),
    GraphqlModule,
    SequelizeModule.forRoot(dataBaseConfig),
    CategoriesModule,
    ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve from the uploads folder
      serveRoot: '/uploads', // Serve files at http://localhost:3000/uploads
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
