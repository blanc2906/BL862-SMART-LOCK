import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./user.schema";
import { Device } from "./device.schema";

export type HomeDocument = Home & Document;

@Schema()
export class Home{
    _id : Types.ObjectId;

    @Prop({required : true, unique : true})
    name : string;

    @Prop({required : true, unique : true})
    address : string;

    @Prop({required: true, ref : 'User', type : Types.ObjectId, unique : true})
    owner : User;

    @Prop({type : [{ type : Types.ObjectId, ref : 'Device'}]})
    homeDevice : Types.ObjectId[];

    @Prop({type : [{ type : Types.ObjectId, ref : 'User'}]})
    familyMember : Types.ObjectId[];


}

export const HomeChema = SchemaFactory.createForClass(Home);