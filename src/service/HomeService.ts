import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from '../entity/Banner';
import { Repository } from 'typeorm';
import { Recommend } from '../entity/Recommend';
import { Goods } from '../entity/Goods';
import { LIMIT } from '../constant';
import { Detail } from '../entity/Detail';

/**
 * 首页服务层
 */
@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(Recommend)
    private readonly recommendRepository: Repository<Recommend>,
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
  ) {}

  /**
   * 查询首页数据
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async queryHome(): Promise<Object> {
    // 获取轮播数据
    const banner = await this.bannerRepository.find();
    const recommend = await this.recommendRepository.find();
    return { banner, recommend };
  }

  /**
   * 查询商品数据
   * @param query
   */
  async queryGoods(type = 'pop', page = 1): Promise<Goods[]> {
    // 计算起始位置
    const skip = (page - 1) * LIMIT.PAGE_SIZE;
    return await this.goodsRepository.find({
      where: { type },
      skip,
      take: LIMIT.PAGE_SIZE,
    });
  }

  /**
   * 根据iid查询商品的详情
   * @param iid
   */
  async queryDetail(iid: string): Promise<Detail> {
    return await this.detailRepository.findOne({ iid });
  }

  /**
   * 根据id查询
   * @param id
   */
  async queryGoodsById(id: number[]): Promise<Goods[]> {
    return await this.goodsRepository.findByIds(id);
  }
}
