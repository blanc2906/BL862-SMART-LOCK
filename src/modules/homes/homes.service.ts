import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Home, HomeDocument } from 'src/database/schema/home.schema';
import { User, UserDocument } from 'src/database/schema/user.schema';
import { HomeDto } from './dto/home.dto';
import { DeviceService } from '../device/device.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class HomesService {
  constructor(
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly deviceService: DeviceService,
    private readonly userService: UsersService,
  ) {}

  async createHome(homeDto: HomeDto, ownerId: string): Promise<Home> {
    const owner = await this.userModel.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const newHome = await this.homeModel.create({
      name: homeDto.name,
      address: homeDto.address,
      owner: owner._id,
      homeDevice: [],
      familyMember: []
    });

    await this.userModel.findByIdAndUpdate(
      owner._id,
      { $push: { ownHome: newHome._id } }
    );

    return newHome;
  }

  async addDeviceToHome(homeId: string, deviceId: string, userId: string): Promise<Home> {
    const [home, device] = await Promise.all([
      this.homeModel.findById(homeId),
      this.deviceService.findDeviceByID(deviceId)
    ]);

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    if (home.homeDevice.includes(device._id)) {
      throw new ForbiddenException('Device already added to this home');
    }

    return this.homeModel.findByIdAndUpdate(
      homeId,
      { $push: { homeDevice: device._id } },
      { new: true }
    );
  }

  async addMemberToHome(homeId: string, memberId: string, ownerId: string): Promise<Home> {
    const [home, member] = await Promise.all([
      this.homeModel.findById(homeId),
      this.userService.fingUserByID(memberId)
    ]);

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    if (home.familyMember.includes(member._id)) {
      throw new ForbiddenException('User is already a member of this home');
    }

    return this.homeModel.findByIdAndUpdate(
      homeId,
      { $push: { familyMember: member._id } },
      { new: true }
    );
  }

  async getHomesByUser(userId: string): Promise<Home[]> {
    return this.homeModel.find({
      $or: [
        { owner: userId },
        { familyMember: userId }
      ]
    }).populate('owner', 'name email')
      .populate('familyMember', 'name email');
  }

  async getFamilyMembers(homeId: string) {
    const home = await this.homeModel.findById(homeId)
      .populate('owner', 'name email')
      .populate('familyMember', 'name email');
    
    if (!home) {
      throw new NotFoundException('Home not found');
    }

    return {
      owner: home.owner,
      members: home.familyMember
    };
  }

  async getHomeDevices(homeId: string) {
    const home = await this.homeModel.findById(homeId)
      .populate('homeDevice');
    
    if (!home) {
      throw new NotFoundException('Home not found');
    }

    return home.homeDevice;
  }
}
