import { Module } from "@nestjs/common";
import { MqttModule } from "../mqtt/mqtt.module";
import { DeviceController } from "./device.controller";
import { DeviceService } from "./device.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Home, HomeChema } from "src/database/schema/home.schema";
import { User, UserSchema } from "src/database/schema/user.schema";
import { Device, DeviceSchema } from "src/database/schema/device.schema";


@Module ({
    imports : [MongooseModule.forFeature([
          { name: Home.name, schema: HomeChema },
          { name: User.name, schema: UserSchema },
          { name: Device.name, schema: DeviceSchema }
        ]),
        MqttModule
    ],
    controllers: [DeviceController],
    providers : [DeviceService],
    exports : [DeviceService]
})

export class DeviceModule {}