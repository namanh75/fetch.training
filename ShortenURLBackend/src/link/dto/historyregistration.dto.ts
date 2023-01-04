import { AutoMap } from '@automapper/classes';

export class HistoryRegistrationDto {
  @AutoMap()
  id: number;

  @AutoMap()
  username: string;

  @AutoMap()
  packagename: string;

  @AutoMap()
  packagetime: number;

  @AutoMap()
  packagetimeunit: string;

  @AutoMap()
  registerday: Date;

  @AutoMap()
  packagepayment: number;

  @AutoMap()
  packagepaymentunit: string;
}

export class HistoryRegistrationMethodDto extends HistoryRegistrationDto {
  getPayment(packagepayment: number, packagepaymentunit: string) {
    super.packagepayment = packagepayment;
    super.packagepaymentunit = packagepaymentunit;
    return this;
  }
}
