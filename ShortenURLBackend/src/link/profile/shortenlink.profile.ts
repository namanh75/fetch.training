import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  CamelCaseNamingConvention,
  createMap,
  Mapper,
  MappingProfile,
  namingConventions,
  typeConverter,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ShortenLink } from '../entities/shortenlink.entity';
import { ShortenLinkDto } from '../dto/shortenlink.dto';
import { PackageLink } from '../entities/packages.entity';
import { PackageDto } from '../dto/package.dto';
import { UserPackage } from '../entities/registration.entity';
import { UserPackageDto, UserPackageMethodDto } from '../dto/registration.dto';
import { HistoryRegistration } from '../entities/historyregistration.entity';
import { HistoryRegistrationDto } from '../dto/historyregistration.dto';

@Injectable()
export class ShortenProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        ShortenLink,
        ShortenLinkDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        namingConventions(new CamelCaseNamingConvention()),
      );
      createMap(
        mapper,
        PackageLink,
        PackageDto,
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
      createMap(
        mapper,
        HistoryRegistration,
        HistoryRegistrationDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        namingConventions(new CamelCaseNamingConvention()),
      );
      createMap(
        mapper,
        UserPackage,
        UserPackageMethodDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        namingConventions(new CamelCaseNamingConvention()),
      );
    };
  }
}
