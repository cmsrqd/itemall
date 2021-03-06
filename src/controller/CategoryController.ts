import { Controller, Get, Query } from '@nestjs/common';
import { Category } from '../entity/Category';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../service/CategoryService';
import { Subcategory } from '../entity/Subcategory';

/**
 * 分类控制层
 */
@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiOperation({
    summary: '查询分类',
  })
  @Get()
  async query(): Promise<Category[]> {
    return this.service.query();
  }

  @ApiOperation({
    summary: '查询分类列表',
  })
  @Get('sub')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async querySubcategory(@Query() maitKey: {}): Promise<Subcategory[]> {
    return this.service.querySubcategory(maitKey);
  }
}
