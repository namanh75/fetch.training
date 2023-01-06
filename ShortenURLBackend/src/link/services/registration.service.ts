import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PACKAGE_PAYMENT_UNIT,
  PACKAGE_TIME_UNIT,
} from '../constants/package.constants';
import {
  HistoryRegistrationDto,
  HistoryRegistrationMethodDto,
} from '../dto/historyregistration.dto';
import {
  MaxNumberLinkDto,
  UserPackageDto,
  UserPackageMethodDto,
} from '../dto/registration.dto';
import { HistoryRegistration } from '../entities/historyregistration.entity';
import { NumberLink } from '../entities/numberlink.entity';
import { PackageLink } from '../entities/packages.entity';
import { UserPackage } from '../entities/registration.entity';
import { ShortenLink } from '../entities/shortenlink.entity';
import { CrudHistoryRegistrationService } from './crud/historyregistration.crud.service';
import { CrudPackageLinkService } from './crud/package.crud.service';
import { CrudRegistrationService } from './crud/registration.crud.service';
const format = require('date-fns/format');

@Injectable()
export class UserShorternLinkService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(UserPackage)
    private userPackageRepository: EntityRepository<UserPackage>,
    @InjectRepository(PackageLink)
    private packageLinkRepository: EntityRepository<PackageLink>,
    @InjectRepository(HistoryRegistration)
    private historyRegistrationRepository: EntityRepository<HistoryRegistration>,
    @InjectRepository(ShortenLink)
    private shortenLinkRepository: EntityRepository<ShortenLink>,
    @InjectRepository(NumberLink)
    private numberLinkRepository: EntityRepository<NumberLink>,
    private readonly crudRegistrationService: CrudRegistrationService,
    private readonly crudPackageLinkService: CrudPackageLinkService,
    private readonly crudHistoryRegistrationService: CrudHistoryRegistrationService,
  ) {}

  async registerPackage(packageData: UserPackageDto): Promise<UserPackageDto> {
    var currentDate = new Date();
    var packageDate = new Date();
    const sqlResultPackage = await this.packageLinkRepository.findOne({
      packagename: packageData.packagename,
    });

    if (!sqlResultPackage) {
      throw new HttpException(
        'Package chưa được tạo hoặc không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    var sqlResultUser = await this.userPackageRepository.findOne({
      username: packageData.username,
      packagestatus: 1,
    });
    if (sqlResultUser) {
      if (sqlResultUser.packagename == packageData.packagename) {
        throw new HttpException(
          'Gói này hiện đang đăng ký',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (sqlResultUser.packagename != packageData.packagename) {
        throw new HttpException(
          'Bạn đang đăng ký gói khác, vui lòng hủy gói trước khi đăng ký gói mới',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    sqlResultUser = await this.userPackageRepository.findOne({
      username: packageData.username,
      packagename: packageData.packagename,
      packagestatus: 0,
    });
    if (sqlResultUser) {
      sqlResultUser.registerday = currentDate;
      packageDate.setMonth(packageDate.getMonth() + packageData.packagetime);
      sqlResultUser.exprirationdate = packageDate;
      sqlResultUser.packagestatus = 1;
      await this.userPackageRepository.persistAndFlush(sqlResultUser);
      return sqlResultUser;
    }
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

    const { packagepayment, packagepaymentunit } = {
      packagepayment: sqlResultPackage.packageprice * packageData.packagetime,
      packagepaymentunit: PACKAGE_PAYMENT_UNIT,
    };
    const dataHistory = new HistoryRegistration(
      id,
      username,
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      packagepayment,
      packagepaymentunit,
    );
    await this.historyRegistrationRepository.persistAndFlush(dataHistory);
    const { currenlink, maxlink, datelink } = {
      currenlink: 0,
      maxlink:
        Number(sqlResultPackage.maxnumberlink) *
        Number(packageData.packagetime),
      datelink: exprirationdate,
    };
    const dataLink = new NumberLink(
      id,
      username,
      currenlink,
      maxlink,
      datelink,
    );
    await this.numberLinkRepository.persistAndFlush(dataLink);
    return new UserPackageMethodDto().registerPackage(data);
  }

  async getPayment(
    pakagename: string,
    packagetime: number,
  ): Promise<HistoryRegistrationDto> {
    const sqlResultPackage = await this.crudPackageLinkService.getPackage(
      pakagename,
    );

    var payment = sqlResultPackage.packageprice * packagetime;
    const registerday = new Date();
    var exprirationdate = new Date();
    exprirationdate.setMonth(registerday.getMonth() + packagetime);

    return new HistoryRegistrationMethodDto().getPayment(
      payment,
      PACKAGE_PAYMENT_UNIT,
    );
  }

  async getRegistrationHistory(
    username: string,
  ): Promise<HistoryRegistrationDto[]> {
    const resultHistory =
      await this.crudHistoryRegistrationService.getHistoryRegistration(
        username,
      );
    return resultHistory;
  }

  async cancelRegistration(
    username: string,
    packagename: string,
  ): Promise<UserPackageDto> {
    await this.crudPackageLinkService.getPackage(packagename);
    var resultUser = await this.crudRegistrationService.getRegistrations(
      username,
      packagename,
    );
    resultUser.packagestatus = 0;
    await this.crudRegistrationService.updateRegistrationInfo(resultUser);
    return new UserPackageMethodDto().cancelPackage(resultUser);
  }

  async extendPackage(packageData: UserPackageDto): Promise<UserPackageDto> {
    var sqlResultPackage = await this.crudPackageLinkService.getPackage(
      packageData.packagename,
    );
    var sqlResultUser = await this.crudRegistrationService.getRegistrations(
      packageData.username,
      packageData.packagename,
    );

    var packageDate = sqlResultUser.exprirationdate;
    packageDate.setMonth(packageDate.getMonth() + packageData.packagetime);
    sqlResultUser.exprirationdate = packageDate;
    sqlResultUser.packagetime =
      Number(sqlResultUser.packagetime) + Number(packageData.packagetime);
    await this.crudRegistrationService.updateRegistrationInfo(sqlResultUser);

    const { id, username, currenlink, maxlink, datelink } = {
      id: null,
      username: packageData.username,
      currenlink: 0,
      maxlink:
        Number(sqlResultPackage.maxnumberlink) *
        Number(packageData.packagetime),
      datelink: packageDate,
    };
    const dataLink = new NumberLink(
      id,
      username,
      currenlink,
      maxlink,
      datelink,
    );
    await this.numberLinkRepository.persistAndFlush(dataLink);

    const {
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      packagepayment,
      packagepaymentunit,
    } = {
      packagename: packageData.packagename,
      packagetime: packageData.packagetime,
      packagetimeunit: PACKAGE_TIME_UNIT,
      registerday: new Date(),
      packagepaymentunit: PACKAGE_PAYMENT_UNIT,
      packagepayment:
        Number(packageData.packagetime) * Number(sqlResultPackage.packageprice),
    };
    const dataHistory = new HistoryRegistration(
      id,
      username,
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      packagepayment,
      packagepaymentunit,
    );
    await this.historyRegistrationRepository.persistAndFlush(dataHistory);
    return new UserPackageMethodDto().registerPackage(sqlResultUser);
  }

  async getStatusPackageOfUser(username: string): Promise<UserPackageDto[]> {
    const sqlResultUser = await this.userPackageRepository.find({
      username: username,
    });
    return sqlResultUser;
  }

  async getMaxNumberLinkOfUser(username: string): Promise<MaxNumberLinkDto> {
    const sqlResultUser = await this.userPackageRepository.find({
      username: username,
    });
    var count = 0;
    var currentDate = new Date();
    for (var user of sqlResultUser) {
      if (user.exprirationdate > currentDate && user.packagestatus == 1) {
        const sqlResultPackage = await this.packageLinkRepository.findOne({
          packagename: user.packagename,
        });
        count = count + Number(sqlResultPackage.maxnumberlink);
      }
    }
    const sqlReSultShortenLink = await this.shortenLinkRepository.findAndCount({
      username: username,
    });

    return new MaxNumberLinkDto(username, count, sqlReSultShortenLink[1]);
  }
}
