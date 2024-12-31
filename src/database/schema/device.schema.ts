import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Home } from "./home.schema";

export type DeviceDocument = Device & Document;
@Schema()
export class Device{
    _id : Types.ObjectId;

    @Prop({required: true, unique : true})
    deviceSerial : string;

    @Prop()
    description : string;

    @Prop({unique : true, type : Types.ObjectId, ref : 'Home'})
    homeBelong : Home;

    @Prop({ type: [String], default: [] })
    cardNumbers: string[];
}

export const DeviceSchema = SchemaFactory.createForClass(Device);