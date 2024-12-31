import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry } from 'rxjs';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private isConnected = false;
  private readonly connectionTimeout = 5000; // 5 seconds
  private readonly maxRetries = 3;

  constructor(@Inject('MQTT_CLIENT') private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.connect();
    } catch (error) {
      this.logger.error('Failed to initialize MQTT connection', error);
    }
  }

  private async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to MQTT broker');
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Failed to connect to MQTT broker', error);
      throw error;
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await lastValueFrom(
        this.client.emit(topic, message).pipe(
          timeout(this.connectionTimeout),
          retry(this.maxRetries)
        )
      );
    } catch (error) {
      this.logger.error(`Failed to publish message to ${topic}`, error);
      throw new Error(`MQTT publish failed: ${error.message}`);
    }
  }
} 