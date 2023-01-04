import { logger, MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { LinkModule } from './link/shortenlink.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      type: 'mysql',
      dbName: 'demo_nestjs',
      password: '12345678',
      autoLoadEntities: true,
      logger: logger.log.bind(logger),
    }),
    AuthModule,
    UsersModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    LinkModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
