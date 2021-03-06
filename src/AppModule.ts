import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { UserModule } from './module/UserModule';
import { HomeModule } from './module/HomeModule';
import { CategoryModule } from './module/CategoryModule';
import { CartModule } from './module/CartModule';
import { OrderModule } from './module/OrderModule';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    UserModule,
    HomeModule,
    CategoryModule,
    CartModule,
    OrderModule,
    // 注入数据模块
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), { autoLoadEntities: true }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../dist', 'upload'),
    }),
  ],
})
export class AppModule {}
