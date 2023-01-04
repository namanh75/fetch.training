import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthDto> {
    const result = await this.authService.login(req.user);
    res.set('Access-Token', result.access_token_name);
    res.set('Refresh-Token', result.refresh_token_name);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout/:username')
  async logout(
    @Req() req,
    @Param('username') username: string,
  ): Promise<AuthDto> {
    const result = await this.authService.logout(username);
    return result;
  }

  @Get('/refresh-token/:username')
  async refreshToken(
    @Req() req,
    @Param('username') username: string,
  ): Promise<AuthDto> {
    var refresh_token = req.headers.authorization.slice(7);
    const result = await this.authService.refreshToken(username, refresh_token);
    return result;
  }
}
