import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/users/entities/users.entity';
import { PackageLink } from './entities/packages.entity';
import { ShortenLink } from './entities/shortenlink.entity';
import { PackageLinkController } from './controllers/package.controller';
import { PackageLinkService } from './services/package.service';
import { LinkController } from './controllers/shortenlink.controller';
import { ShortenLinkService } from './services/shortenlink.service';
import { UserPackage } from './entities/registration.entity';
import { UserShoternLinkController } from './controllers/registration.controller';
import { UserShorternLinkService } from './services/registration.service';
import { ShortenProfile } from './profile/shortenlink.profile';
import { HistoryRegistration } from './entities/historyregistration.entity';
import { NumberLink } from './entities/numberlink.entity';
import { CrudShortenLinkService } from './services/crud/shortenlink.crud.service';
import { CrudRegistrationService } from './services/crud/registration.crud.service';
import { CrudPackageLinkService } from './services/crud/package.crud.service';
import { CrudHistoryRegistrationService } from './services/crud/historyregistration.crud.service';
import { Session } from './entities/session.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      ShortenLink,
      User,
      PackageLink,
      UserPackage,
      HistoryRegistration,
      NumberLink,
      Session
    ]),
  ],
  controllers: [
    LinkController,
    PackageLinkController,
    UserShoternLinkController,
  ],
  providers: [
    ShortenLinkService,
    PackageLinkService,
    UserShorternLinkService,
    ShortenProfile,
    CrudShortenLinkService,
    CrudRegistrationService,
    CrudPackageLinkService,
    CrudHistoryRegistrationService,
  ],
  exports: [ShortenLinkService],
})
export class LinkModule {}
