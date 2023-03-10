import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';

@Entity({ tableName: 'user_package' })
export class UserPackage {
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
  exprirationdate: Date;

  @Property()
  @AutoMap()
  packagestatus: number;

  constructor(
    id: number,
    username: string,
    packagename: string,
    packagetime: number,
    packagetimeunit: string,
    registerday: Date,
    exprirationdate: Date,
    packagestatus: number,
  ) {
    this.id = id;
    this.username = username;
    this.packagename = packagename;
    this.packagetime = packagetime;
    this.packagetimeunit = packagetimeunit;
    this.registerday = registerday;
    this.exprirationdate = exprirationdate;
    this.packagestatus = packagestatus;
  }
}
