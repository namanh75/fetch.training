import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  PACKAGE_PAYMENT_UNIT,
  PACKAGE_TIME_UNIT,
} from 'src/link/constants/package.constants';
import { HistoryRegistration } from 'src/link/entities/historyregistration.entity';
import { PackageLink } from 'src/link/entities/packages.entity';
import { UserPackage } from 'src/link/entities/registration.entity';

export class CrudHistoryRegistrationService {
  constructor(
    @InjectRepository(PackageLink)
    private packageLinkRepository: EntityRepository<PackageLink>,
    @InjectRepository(HistoryRegistration)
    private historyRegistrationRepository: EntityRepository<HistoryRegistration>,
  ) {}

  async getHistoryRegistration(
    username: string,
  ): Promise<HistoryRegistration[]> {
    const sqlResultHistory = await this.historyRegistrationRepository.find({
      username: username,
    });
    return sqlResultHistory;
  }

  async addRegistrationToHistory(
    packageData: UserPackage,
  ): Promise<HistoryRegistration> {
    var currentDate = new Date();
    const sqlResultPackage = await this.packageLinkRepository.findOne({
      packagename: packageData.packagename,
    });
    const {
      id,
      username,
      packagename,
      packagetime,
      packagetimeunit,
      registerday,
      packagepayment,
      packagepaymentunit,
    } = {
      id: null,
      username: packageData.username,
      packagename: packageData.packagename,
      packagetime: packageData.packagetime,
      packagetimeunit: PACKAGE_TIME_UNIT,
      registerday: currentDate,
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
    return dataHistory;
  }
}
