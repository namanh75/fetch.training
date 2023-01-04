import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PACKAGE_PAYMENT_UNIT,
  PACKAGE_TIME_UNIT,
} from 'src/link/constants/package.constants';
import { UserPackageDto } from 'src/link/dto/registration.dto';
import { HistoryRegistration } from 'src/link/entities/historyregistration.entity';
import { PackageLink } from 'src/link/entities/packages.entity';
import { UserPackage } from 'src/link/entities/registration.entity';

export class CrudRegistrationService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(UserPackage)
    private userPackageRepository: EntityRepository<UserPackage>,
  ) {}

  async getRegistrations(
    username: string,
    packagename: string,
  ): Promise<UserPackage> {
    const sqlResultUser = await this.userPackageRepository.findOne({
      username: username,
      packagename: packagename,
    });
    if (!sqlResultUser || sqlResultUser.packagestatus == 0) {
      throw new HttpException(
        'Người dùng chưa đăng ký gói này',
        HttpStatus.BAD_REQUEST,
      );
    }
    return sqlResultUser;
  }

  async registerPackage(packageData: UserPackageDto): Promise<UserPackage> {
    var currentDate = new Date();
    var packageDate = new Date();
    packageDate.setMonth(packageDate.getMonth() + packageData.packagetime);
    const {
      id,
      username,
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      exprirationdate,
      packagestatus,
    } = {
      id: null,
      username: packageData.username,
      packagename: packageData.packagename,
      packagetime: packageData.packagetime,
      packagetimeunit: PACKAGE_TIME_UNIT,
      registerday: currentDate,
      exprirationdate: packageDate,
      packagestatus: 1,
    };
    const data = new UserPackage(
      id,
      username,
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      exprirationdate,
      packagestatus,
    );
    await this.userPackageRepository.persistAndFlush(data);
    return data;
  }

  async updateRegistrationInfo(packageData: UserPackage): Promise<UserPackage> {
    await this.userPackageRepository.persistAndFlush(packageData);
    return packageData
  }
  
  async cancelRegistrationPackages(): Promise<void> {}
}
