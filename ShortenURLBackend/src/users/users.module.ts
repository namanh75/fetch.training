import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RefreshToken } from '../auth/entities/refreshtoken.entity';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from './profile/users.profile';

@Module({
  imports: [MikroOrmModule.forFeature([User, RefreshToken])],
  providers: [UsersService, UserProfile],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
