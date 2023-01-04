import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PACKAGE_PAYMENT_UNIT } from 'src/link/constants/package.constants';
import { PackageLink } from 'src/link/entities/packages.entity';

export class CrudPackageLinkService {
  constructor(
    @InjectRepository(PackageLink)
    private packageLinkRepository: EntityRepository<PackageLink>,
  ) {}

  async getAllPackage(): Promise<PackageLink[]> {
    return await this.packageLinkRepository.findAll({
      orderBy: { maxnumberlink: QueryOrder.desc },
    });
  }

  async getPackage(packagename: string) {
    var sqlResultPackageName = await this.packageLinkRepository.findOne({
      packagename: packagename,
    });
    if (!sqlResultPackageName) {
      throw new HttpException('Package không tồn tại', HttpStatus.BAD_REQUEST);
    }
    return sqlResultPackageName;
  }

  async createPackage(packageData: PackageLink): Promise<PackageLink> {
    const {
      packagename,
      packageprice,
      packagepaymentnunit,
      packagetimeunit,
      maxnumberlink,
      description,
    } = {
      packagename: packageData.packagename,
      packageprice: packageData.packageprice,
      packagepaymentnunit: PACKAGE_PAYMENT_UNIT,
      packagetimeunit: packageData.packagetimeunit,
      maxnumberlink: packageData.maxnumberlink,
      description: packageData.description,
    };
    const data = new PackageLink(
      packagename,
      packageprice,
      packagepaymentnunit,
      packagetimeunit,
      maxnumberlink,
      description,
    );
    await this.packageLinkRepository.persistAndFlush(data);
    return data;
  }

  async updatePackage(packageData: PackageLink): Promise<PackageLink> {
    await this.packageLinkRepository.persistAndFlush(packageData);
    return packageData;
  }

  async deletePackage(packageData: PackageLink): Promise<void> {}
}
