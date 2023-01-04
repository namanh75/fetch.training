import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { Param, UseInterceptors } from '@nestjs/common/decorators';
import { MapInterceptor, MapPipe } from '@automapper/nestjs';
import { User } from './entities/users.entity';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() user: UserDto): Promise<UserDto> {
    const result = await this.usersService.createNewUser(user);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<UserDto> {
    const result = await this.usersService.getProfile(req.user.username);
    return result;
  }
}
