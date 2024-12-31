import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { Home } from './home.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ unique : true })
  cardNumbers: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Home' }] })
  ownHome: Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);
