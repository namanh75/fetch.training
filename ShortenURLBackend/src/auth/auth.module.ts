import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constant';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshToken } from './entities/refreshtoken.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MikroOrmModule.forFeature([RefreshToken, User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.token_expires_in },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
