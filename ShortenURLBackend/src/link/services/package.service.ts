import { EntityManager, MikroORM } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PackageDto } from '../dto/package.dto';
import { PackageLink } from '../entities/packages.entity';
import { CrudPackageLinkService } from './crud/package.crud.service';

@Injectable()
export class PackageLinkService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly crudPackageLinkService: CrudPackageLinkService,
  ) {}

  async getPackageLink(): Promise<PackageDto[]> {
    const data = await this.crudPackageLinkService.getAllPackage();
    return data;
  }

  async getPackageInfo(packagename: string): Promise<PackageDto> {
    const data = await this.crudPackageLinkService.getPackage(packagename);
    return data;
  }

  async createPackage(packageData: PackageLink): Promise<PackageDto> {
    const resultPackage = await this.crudPackageLinkService.getPackage(
      packageData.packagename,
    );
    if (resultPackage)
      throw new HttpException(
        'Gói này đã được tạo rồi',
        HttpStatus.BAD_REQUEST,
      );
    const data = await this.crudPackageLinkService.createPackage(packageData);
    return data;
  }
}
