import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class PackageDto {
  @IsNotEmpty({ message: 'Package name is required' })
  @AutoMap()
  packagename: string;

  @IsNotEmpty({ message: 'Package price is required' })
  @AutoMap()
  packageprice: number;

  @IsNotEmpty({ message: 'Package payment unit is required' })
  @AutoMap()
  packagepaymentunit: string;

  @IsNotEmpty({ message: 'Package price is required' })
  @AutoMap()
  packagetimeunit: string;

  @IsNotEmpty({ message: 'Max number link is required' })
  @AutoMap()
  maxnumberlink: number;

  @IsNotEmpty({ message: 'Description is required' })
  @AutoMap()
  description: string;
}
