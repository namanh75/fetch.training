import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HistoryRegistrationDto } from '../dto/historyregistration.dto';
import { MaxNumberLinkDto, UserPackageDto } from '../dto/registration.dto';
import { HistoryRegistration } from '../entities/historyregistration.entity';
import { UserPackage } from '../entities/registration.entity';
import { UserShorternLinkService } from '../services/registration.service';

@Controller('shorten-link/registration')
export class UserShoternLinkController {
  constructor(
    private readonly userShorternLinkService: UserShorternLinkService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(MapInterceptor(UserPackage, UserPackageDto))
  @Post('/add')
  async registerPackage(
    @Body() packageData: UserPackageDto,
    @Req() req,
  ): Promise<UserPackageDto> {
    packageData.username = req.user.username;
    const result = await this.userShorternLinkService.registerPackage(
      packageData,
    );
    return result;
  }

  @Post('/payment')
  @UsePipes(ValidationPipe)
  @UseInterceptors(MapInterceptor(HistoryRegistration, HistoryRegistrationDto))
  async getPayment(
    @Body() payload: UserPackageDto,
  ): Promise<HistoryRegistrationDto> {
    const result = await this.userShorternLinkService.getPayment(
      payload.packagename,
      payload.packagetime,
    );
    return result;
  }

  @Get('/history')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    MapInterceptor(HistoryRegistration, HistoryRegistrationDto, {
      isArray: true,
    }),
  )
  async getRegistrationHistory(@Req() req): Promise<HistoryRegistrationDto[]> {
    const result = await this.userShorternLinkService.getRegistrationHistory(
      req.user.username,
    );
    return result;
  }

  @Delete('/:packagename')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(UserPackage, UserPackageDto))
  async CancelRegistration(
    @Req() req,
    @Param('packagename') packagename: string,
  ): Promise<UserPackageDto> {
    const username = req.user.username;
    const result = await this.userShorternLinkService.cancelRegistration(
      username,
      packagename,
    );
    return result;
  }

  @Post('extend')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(MapInterceptor(UserPackage, UserPackageDto))
  async extendPackage(
    @Req() req,
    @Body() packageData: UserPackageDto,
  ): Promise<UserPackageDto> {
    packageData.username = req.user.username;
    const result = await this.userShorternLinkService.extendPackage(
      packageData,
    );
    return result;
  }

  @Get('/information')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    MapInterceptor(UserPackage, UserPackageDto, { isArray: true }),
  )
  async getStatusPackageOfUser(@Req() req): Promise<UserPackageDto[]> {
    const username = req.user.username;
    const result = await this.userShorternLinkService.getStatusPackageOfUser(
      username,
    );
    return result;
  }

  @Get('/max-number-link')
  @UseGuards(JwtAuthGuard)
  async getMaxNumberLink(@Req() req): Promise<MaxNumberLinkDto> {
    const username = req.user.username;
    const result = await this.userShorternLinkService.getMaxNumberLinkOfUser(
      username,
    );
    return result;
  }
}
