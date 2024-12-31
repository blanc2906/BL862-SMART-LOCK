import { Injectable, NotFoundException } from "@nestjs/common";
import { MqttService } from "../mqtt/mqtt.service";
import { StringHelper } from "src/shared/helpers/string.helper";
import { DEVICE_TOPIC, EMPTY_CARD, REMOTE_OPEN } from "src/shared/constants/mqtt.constant";
import { TimeHelper } from "src/shared/helpers/timer.helper";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from 'src/database/schema/device.schema';
import { Home, HomeDocument } from 'src/database/schema/home.schema';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
        @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
        private readonly mqttService: MqttService
    ) {}

    async createDevice(deviceDto: DeviceDto): Promise<Device> {
        // const home = await this.homeModel.findOne({ _id: deviceDto.homeBelong });
        // if (!home) {
        //     throw new NotFoundException('Home not found');
        // }

        const newDevice = new this.deviceModel({
            deviceSerial: deviceDto.deviceSerial,
            //homeBelong: home._id,
            description : deviceDto.description
        });

        const savedDevice = await newDevice.save();

        // await this.homeModel.findByIdAndUpdate(
        //     home._id,
        //     { $push: { homeDevice: savedDevice._id } }
        // );

        return savedDevice;
    }

    async findDeviceByID(deviceId: string): Promise<Device>{
        try {
            const device = await this.deviceModel.findById(deviceId);
            if(!device){
                throw new NotFoundException("Device Not Found");
            }
            return device;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new NotFoundException("Invalid Device ID format");
            }
            throw error;
        }
    }

    private async publishCommand(deviceSerial : string,commandId: number, value: string) {
        const message = { commandid: commandId, value };
        const deviceTopic = `cloud_subscribe_topic_${deviceSerial}`
        await this.mqttService.publish(deviceTopic, message);
    }

    async remoteOpen(deviceSerial : string) {
        await this.publishCommand(deviceSerial,61, REMOTE_OPEN);
    }

    async synchronizeTime(deviceSerial : string) {
        const currentTime = TimeHelper.getCurrentTimeFormat();
        await this.publishCommand(deviceSerial,64, `000E64${currentTime}000000015568`);
    }

    async addCard(deviceSerial: string, cardNumber: string) {
        const device = await this.deviceModel.findOne({ deviceSerial });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        if (device.cardNumbers.includes(cardNumber)) {
            throw new Error('Card number already exists in this device');
        }

        const processedCard = StringHelper.processCardNumber(cardNumber);
        await this.publishCommand(deviceSerial, 60, `00085101${processedCard}000000015568`);

        await this.deviceModel.findByIdAndUpdate(
            device._id,
            { $push: { cardNumbers: cardNumber } }
        );
    }

    async deleteCard(deviceSerial: string, cardNumber: string) {
        const device = await this.deviceModel.findOne({ deviceSerial });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        if (!device.cardNumbers.includes(cardNumber)) {
            throw new Error('Card number not found in this device');
        }

        const processedCard = StringHelper.processCardNumber(cardNumber);
        await this.publishCommand(deviceSerial, 52, `00085201${processedCard}000000015568`);

        await this.deviceModel.findByIdAndUpdate(
            device._id,
            { $pull: { cardNumbers: cardNumber } }
        );
    }

    async emptyCard(deviceSerial: string) {
        const device = await this.deviceModel.findOne({ deviceSerial });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        await this.publishCommand(deviceSerial, 45, EMPTY_CARD);

        await this.deviceModel.findByIdAndUpdate(
            device._id,
            { $set: { cardNumbers: [] } }
        );
    }

    async setFixedPwd(deviceSerial : string,password: string) {
        const value = '000556' + StringHelper.processCardNumber(password) + '0000000015568';
        await this.publishCommand(deviceSerial,56, value);
    }

    async checkCardAccess(deviceId: string, cardNumber: string): Promise<boolean> {
        const device = await this.deviceModel.findById(deviceId);
        if (!device) {
            throw new NotFoundException('Device not found');
        }
        return device.cardNumbers.includes(cardNumber);
    }
}