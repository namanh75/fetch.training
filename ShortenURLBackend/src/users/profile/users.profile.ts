import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  CamelCaseNamingConvention,
  createMap,
  extend,
  Mapper,
  MappingProfile,
  namingConventions,
  typeConverter,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserDto } from '../dto/users.dto';
import { UserPackage } from 'src/link/entities/registration.entity';
import { UserPackageDto} from 'src/link/dto/registration.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        User,
        UserDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        namingConventions(new CamelCaseNamingConvention()),
      );
      createMap(
        mapper,
        UserPackage,
        UserPackageDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        namingConventions(new CamelCaseNamingConvention()),
      );
    };
  }
}
