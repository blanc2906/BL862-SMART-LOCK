import { Module } from '@nestjs/common';
import appConfig from './configs/app.config';
import mqttConfig from './configs/mqtt.config';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { DeviceModule } from './modules/device/device.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { HomesModule } from './modules/homes/homes.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        mqttConfig,
      ],
      envFilePath: ['.env'],
    }),
    DeviceModule,
    MqttModule,
    UsersModule,
    DatabaseModule,
    HomesModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
