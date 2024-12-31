import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schema/user.schema';
import { DeviceService } from '../device/device.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    @Inject() private deviceService : DeviceService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async fingUserByID( userId:string) : Promise<User>{
    const user = await this.userModel.findOne({_id  : userId});
    if(!user){
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;

  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
