import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { PackageDto } from '../dto/package.dto';
import { PackageLink } from '../entities/packages.entity';
import { PackageLinkService } from '../services/package.service';

@Controller('shorten-link/package')
export class PackageLinkController {
  constructor(private readonly packageLinkService: PackageLinkService) {}

  @Get('/all')
  async getAllPackageLink(): Promise<PackageDto[]> {
    const results = await this.packageLinkService.getPackageLink();
    return results;
  }

  @Get('/:packagename')
  @UseInterceptors(MapInterceptor(PackageLink, PackageDto))
  async getPaymentInfo(
    @Param('packagename') packagename: string,
  ): Promise<PackageDto> {
    const result = await this.packageLinkService.getPackageInfo(packagename);
    return result;
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseInterceptors(MapInterceptor(PackageLink, PackageDto))
  async createPackage(@Body() packageData: PackageDto): Promise<PackageDto> {
    const results = await this.packageLinkService.createPackage(packageData);
    return results;
  }
}
