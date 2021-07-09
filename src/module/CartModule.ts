import { Module } from '@nestjs/common';
import { CartController } from '../controller/CartController';
import { CartService } from '../service/CartService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entity/Cart';
import { JwtModule } from '@nestjs/jwt';
import { JWTConstant } from '../constant';
import { Goods } from '../entity/Goods';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Goods]),
    // 注册jwt模块
    JwtModule.register({
      secret: JWTConstant.secret,
      signOptions: { expiresIn: JWTConstant.expiresIn },
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
