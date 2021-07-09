import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { sendCode } from 'src/util';
import { JwtService } from '@nestjs/jwt';

/**
 * 用户的服务层
 */
@Injectable()
export class UserService {
  // 注入存储库
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 发送验证码
   * @param body
   */
  async sendCode(body): Promise<string> {
    const isExist = await this.findOne({ phone: body.phone });
    if (isExist) return '手机号已注册';
    return sendCode(body.phone, body.code);
  }

  /**
   * 添加用户
   * @param user
   */
  async save(user: User): Promise<string> {
    await this.userRepository.save(user);
    if (user.id) return '添加成功';
    throw new ForbiddenException('添加失败');
  }

  /**
   * 根据条件查询一个
   * 登录/查询是否存在
   * @param user
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOne(user: User | Object): Promise<User> {
    return await this.userRepository.findOne(user);
  }

  /**
   * 登录
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async login(user: User): Promise<Object> {
    const loginUser = await this.userRepository.findOne(
      { phone: user.phone },
      {
        select: [
          'id',
          'nickName',
          'email',
          'gander',
          'phone',
          'avatar',
          'password',
        ],
      },
    );
    if (!loginUser) throw new BadRequestException('手机号不存在');
    if (loginUser.password !== user.password)
      throw new BadRequestException('密码错误');
    // 登录成功开始颁发token
    const token = this.jwt.sign({ id: loginUser.id, phone: loginUser.phone });
    // 删除密码
    delete loginUser.password;
    return { user: loginUser, token };
  }

  /**
   * 修改
   * @param user
   */
  async modify(user: User): Promise<string> {
    // id 转为number
    if (typeof user.id === 'string') user.id = parseInt(String(user.id));
    const { updateDatetime } = await this.userRepository.save(user);
    if (updateDatetime) return '修改成功';
    throw new ForbiddenException('修改失败');
  }
}

// 增
// save(user)            创建：返回该数据的所有字段
// insert(user)          快速插入一条数据，插入成功：返回插入实体，与save方法不同的是，它不执行级联、关系和其他操作。
// 删
// remove(user)          删除：返回该数据的可见字段
// softRemove(user);     拉黑：返回该数据的可见字段，该删除实体必须拥有@DeleteDateColumn()字段，被拉黑的用户还存在数据库中，但无法被find查找到，会在@DeleteDateColumn()字段中添加删除时间，可使用recover恢复
// 改
// update(id, user)      更新：返回更新实体，不是该数据的字段
// 恢复
// recover({ id })       恢复：返回id，将被softRemove删除（拉黑）的用户恢复，恢复成功后可以被find查找到
//
//
// 查找全部
// find()
// find({id:9})                   条件查找，写法一，找不到返回空对象
// find({where:{id:10}})          条件查找，写法二，找不到返回空对象
// findAndCount()                 返回数据和总的条数
//
// 查找一个
// findOne(id);                       根据ID查找，找不到返回undefined
// findOne({ where: { username } });  条件查找，找不到返回undefined
//
// 根据ID查找一个或多个
// findByIds([1,2,3]);            查找n个，全部查找不到返回空数组，找到就返回找到的
//
// 其他
// hasId(new UsersEntity())       检测实体是否有合成ID，返回布尔值
// getId(new UsersEntity())       获取实体的合成ID，获取不到返回undefined
// create({username: 'admin12345', password: '123456',})  创建一个实体，需要调用save保存
// count({ status: 1 })           计数，返回数量，无返回0
// increment({ id }, 'age', 2);   增加，给条件为id的数据的age字段增加2，成功返回改变实体
// decrement({ id }, 'age', 2)    减少，给条件为id的数据的age字段增加2，成功返回改变实体
//
// 谨用
// findOneOrFail(id)              找不到直接报500错误，无法使用过滤器拦截错误，不要使用
// clear()
