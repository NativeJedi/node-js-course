import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { ProfilesModule } from './profiles/profiles.module';
import { LoggerModule } from './logger/logger.module';
import { ValidationExceptionsFilter } from './filters/validation-exceptions.filter';

@Module({
  imports: [
    LoggerModule,
    ProfilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: ValidationExceptionsFilter,
    },
  ],
})
export class AppModule {}
