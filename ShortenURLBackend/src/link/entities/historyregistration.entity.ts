import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';

@Entity({ tableName: 'historyregistration' })
export class HistoryRegistration {
  @PrimaryKey()
  id: number;

  @IsNotEmpty({ message: 'username is required' })
  @Property()
  @AutoMap()
  username: string;

  @IsNotEmpty({ message: 'packagename is required' })
  @Property()
  @AutoMap()
  packagename: string;

  @Property()
  @AutoMap()
  packagetime: number;

  @Property()
  @AutoMap()
  packagetimeunit: string;

  @Property()
  @AutoMap()
  registerday: Date;

  @Property()
  @AutoMap()
  packagepayment: number;

  @Property()
  @AutoMap()
  packagepaymentunit: string;

  constructor(
    id: number,
    username: string,
    packagename: string,
    packagetime: number,
    packagetimeunit: string,
    registerday: Date,
    packagepayment: number,
    packagepaymentunit: string,
  ) {
    this.id = id;
    this.username = username;
    this.packagename = packagename;
    this.packagetime = packagetime;
    this.packagetimeunit = packagetimeunit;
    this.registerday = registerday;
    this.packagepayment = packagepayment;
    this.packagepaymentunit = packagepaymentunit;
  }
}
