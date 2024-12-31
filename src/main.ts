import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TAppConfig } from './configs/app.config';
import { TMqttConfig } from './configs/mqtt.config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const options: NestApplicationOptions = {
    cors: true,
  };
  const app = await NestFactory.create(AppModule, options);

  const configService = app.get(ConfigService);

  // const host = configService.getOrThrow<TAppConfig>('app').host;
  // const port = configService.getOrThrow<TAppConfig>('app').port;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: configService.getOrThrow<TMqttConfig>('mqtt').url,
      username: configService.getOrThrow<TMqttConfig>('mqtt').username,
      password: configService.getOrThrow<TMqttConfig>('mqtt').password,
    },
  });

  await app.startAllMicroservices();
  //console.log('Microservices are running', 'Bootstrap');

  await app.listen(4000);
}
bootstrap();
