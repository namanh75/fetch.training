import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { UserPackage } from '../entities/registration.entity';

export class UserPackageDto {
  id: number;

  @AutoMap()
  username: string;

  @IsNotEmpty({ message: 'Package name is required' })
  @AutoMap()
  packagename: string;

  @IsNotEmpty({ message: 'Package time is required' })
  @IsNumber()
  @Min(1)
  @Max(12)
  @AutoMap()
  packagetime: number;

  @AutoMap()
  packagetimeunit: string;

  @AutoMap()
  registerday: Date;

  @AutoMap()
  exprirationdate: Date;

  @AutoMap()
  packagestatus: number;
}

export class UserPackageMethodDto extends UserPackageDto {
  //register a new package or extend package
  registerPackage(packageData: UserPackage) {
    super.id = packageData.id;
    super.username = packageData.username;
    super.packagename = packageData.packagename;
    super.registerday = packageData.registerday;
    super.exprirationdate = packageData.exprirationdate;
    super.packagestatus = packageData.packagestatus;
    return this;
  }

  cancelPackage(packageData: UserPackage) {
    super.username = packageData.username;
    super.packagename = packageData.packagename;
    super.packagestatus = packageData.packagestatus;
    return this;
  }
}

export class MaxNumberLinkDto {
  username: string;
  maxnumberlink: number;
  numberlinkuse: number;
  constructor(username: string, maxnumberlink: number, numberlinkuse: number) {
    this.username = username;
    this.maxnumberlink = maxnumberlink;
    this.numberlinkuse = numberlinkuse;
  }
}
