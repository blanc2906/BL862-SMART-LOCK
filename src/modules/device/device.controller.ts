import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { MqttService } from "../mqtt/mqtt.service";
import { Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";
import { DeviceDto } from "./dto/device.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DeviceGuard } from "./guards/device.guard";

@Controller('device')
@UseGuards(JwtAuthGuard)
export class DeviceController {
    constructor(
        private readonly deviceService : DeviceService,
        private readonly mqttService : MqttService
    ){}

    @Post('create-device')
    async createDevice(@Body() deviceDto : DeviceDto){
        await this.deviceService.createDevice(deviceDto);
    }


    private async handleRequest<T>(operation: () => Promise<T>) {
        try {
            const result = await operation();
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    @Post(':deviceId/remote-open')
    @UseGuards(DeviceGuard)
    async remoteOpen(@Param('deviceId') deviceId: string){
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.remoteOpen(device.deviceSerial));
    }

    @Post(':deviceId/synchronize-time')
    @UseGuards(DeviceGuard)
    async synchronizeTime(@Param('deviceId') deviceId: string) {
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.synchronizeTime(device.deviceSerial));
    }
    @Post(':deviceId/add-card')
    @UseGuards(DeviceGuard)
    async addCard(
        @Param('deviceId') deviceId: string,
        @Body('cardNumber') cardNumber: string
    ) {
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.addCard(device.deviceSerial, cardNumber));
    }

    @Post(':deviceId/delete-card')
    @UseGuards(DeviceGuard)
    async deleteCard(
        @Param('deviceId') deviceId: string,
        @Body('cardNumber') cardNumber: string
    ) {
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.deleteCard(device.deviceSerial, cardNumber));
    }

    @Post(':deviceId/empty-card')
    @UseGuards(DeviceGuard)
    async emptyCard(@Param() deviceId : string){
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.emptyCard(device.deviceSerial));
    }

    @Post(':deviceId/set-password')
    @UseGuards(DeviceGuard)
    async setFixedPwd(
        @Param('deviceId') deviceId: string,
        @Body('password') password: string
    ) {
        const device = await this.deviceService.findDeviceByID(deviceId)
        return this.handleRequest(() => this.deviceService.setFixedPwd(device.deviceSerial, password));
    }

    @MessagePattern('data_publish_topic_1')
    async handleMessage(@Payload() data: any, @Ctx() context: MqttContext) {
        console.log(data);
  }
}