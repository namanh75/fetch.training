import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';

@Entity({ tableName: 'packagelink' })
export class PackageLink {
  @PrimaryKey()
  @IsNotEmpty({ message: 'package name is not empty' })
  @AutoMap()
  packagename: string;

  @Property()
  @IsNotEmpty({ message: 'package price is not empty' })
  @AutoMap()
  packageprice: number;

  @Property()
  @AutoMap()
  packagepaymentunit: string;

  @Property()
  @AutoMap()
  packagetimeunit: string;

  @Property()
  @AutoMap()
  maxnumberlink: number;

  @Property()
  @AutoMap()
  description: string;

  constructor(
    packagename: string,
    packageprice: number,
    packagepaymentunit: string,
    packagetime: string,
    maxnumberlink: number,
    description: string,
  ) {
    this.packagename = packagename;
    this.packageprice = packageprice;
    this.packagepaymentunit = packagepaymentunit;
    this.packagetimeunit = packagetime;
    this.maxnumberlink = maxnumberlink;
    this.description = description;
  }
}
