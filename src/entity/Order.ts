import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDesc } from './OrderDesc';
import { ORDER_STATUS } from '../constant';

/**
 * 订单
 */
@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createDateTime: Date;

  @UpdateDateColumn()
  updateDateTime: Date;

  @Column({
    default: ORDER_STATUS.INIT,
    comment: '0代付款 1 已完成 2取消',
  })
  status: number;

  @Column({
    type: 'double',
    nullable: true,
  })
  totalPrice: number;

  @Column()
  uid: number;

  @Column()
  address: string;

  @DeleteDateColumn()
  delDatetime: Date;

  orderDesc: OrderDesc[];
}
