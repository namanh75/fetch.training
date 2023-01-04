import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refreshtoken.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { jwtConstants } from './constants/constant';
import { User } from 'src/users/entities/users.entity';
import { UserDto } from 'src/users/dto/users.dto';
import { AuthDto } from './dto/auth.dto';
const format = require('date-fns/format');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto> {
    const user = await this.usersService.findOne(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: UserDto): Promise<AuthDto> {
    const payload_access = {
      username: user.username,
      id: user.id,
    };
    const payload_refresh = {
      username: user.username,
      key: jwtConstants.secret,
    };
    var jwt_access = this.jwtService.sign(payload_access);
    const jwt_refresh = this.jwtService.sign(payload_refresh);

    var datenow = new Date();
    datenow.setFullYear(datenow.getFullYear() + 1);
    const token_date = format(datenow, 'yyyy-MM-dd HH:mm:ss');

    var { username, refresh_token_name, refresh_token_expired } = {
      username: user.username,
      refresh_token_name: jwt_refresh,
      refresh_token_expired: token_date,
    };

    const data = new RefreshToken(
      username,
      refresh_token_name,
      refresh_token_expired,
    );
    await this.refreshTokenRepository.persistAndFlush(data);
    return new AuthDto().loginMethod(
      'bearer',
      jwt_access,
      jwtConstants.token_expires_in,
      data.refresh_token_name,
      data.refresh_token_expired,
    );
  }

  async logout(username: string): Promise<any> {
    var sqlResultToken = await this.refreshTokenRepository.findOne(
      {
        username: username,
      },
      {
        orderBy: { refresh_token_expired: QueryOrder.DESC },
      },
    );
    if (!sqlResultToken)
      throw new HttpException(
        'Refresh token không tồn tại, người dùng chưa đăng nhập',
        HttpStatus.BAD_REQUEST,
      );

    var date_now = new Date();
    sqlResultToken.refresh_token_expired = date_now;
    await this.refreshTokenRepository.persistAndFlush(sqlResultToken);
    return new AuthDto().logout();
  }

  async refreshToken(
    user_name: string,
    refresh_token_name: string,
  ): Promise<AuthDto> {
    var sqlResultToken = await this.refreshTokenRepository.findOne({
      username: user_name,
      refresh_token_name: refresh_token_name,
    });
    if (!sqlResultToken) {
      throw new HttpException(
        'Refresh token không tồn tại, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (sqlResultToken.refresh_token_expired < new Date()) {
      throw new HttpException(
        'Refresh token đã hết hạn, vui lòng đăng nhập lại',
        HttpStatus.BAD_REQUEST,
      );
    }

    var user = await this.userRepository.findOne({
      username: user_name,
    });
    const payload_access = {
      username: user.username,
      id: user.id,
    };
    const payload_refresh = {
      username: user.username,
      key: jwtConstants.secret,
    };
    var jwt_access = this.jwtService.sign(payload_access);
    return new AuthDto().refreshMethod(jwt_access);
  }
}
