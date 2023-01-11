import {
  EntityManager,
  EntityRepository,
  MikroORM,
  QueryOrder,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../auth/entities/refreshtoken.entity';
import { UserDto } from './dto/users.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
  ) {}

  async findOne(username: string): Promise<any> {
    var sqlResult = await this.userRepository.findOne({
      username: username,
    });
    return sqlResult;
  }

  async createNewUser(user: UserDto): Promise<UserDto> {
    var sqlResult = await this.userRepository.findOne({
      username: user.username,
    });

    if (sqlResult)
      throw new HttpException(
        'Tên đăng nhập đã tồn tại trên hệ thống',
        HttpStatus.BAD_REQUEST,
      );

    const saltOrRounds = 10;
    var password_hash = user.password;
    user.password = await bcrypt.hash(password_hash, saltOrRounds);

    const { username, password } = user;
    const data = new User(null, username, password);
    await this.userRepository.persistAndFlush(data);
    return data;
  }

  async getProfile(username: string): Promise<UserDto> {
    var sqlResultToken = await this.refreshTokenRepository.findOne(
      {
        username: username,
      },
      {
        orderBy: { refresh_token_expired: QueryOrder.DESC },
      },
    );
    if (!sqlResultToken) {
      throw new HttpException(
        'Refresh token không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (sqlResultToken.refresh_token_expired < new Date()) {
      throw new HttpException(
        'Refresh token đã hết hạn, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }

    var sqlResultProfile = await this.userRepository.findOne({
      username: username,
    });
    sqlResultProfile.password = null;
    return sqlResultProfile;
  }
}
