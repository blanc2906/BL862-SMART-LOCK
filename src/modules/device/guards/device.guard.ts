import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from '../../../database/schema/device.schema';
import { Home } from '../../../database/schema/home.schema';
import { User } from '../../../database/schema/user.schema';
import { DeviceService } from '../device.service';

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(User.name) private userModel: Model<User>,
    private deviceService: DeviceService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.params.deviceId;
    const userId = request.user?.userId;
    const path = request.route.path;

    if (!deviceId) {
      throw new ForbiddenException('Device ID is required');
    }

    const device = await this.deviceModel.findById(deviceId);
    if (!device) {
      throw new ForbiddenException('Device not found');
    }

    const home = await this.homeModel.findOne({
      homeDevice: device._id
    });

    if (!home) {
      throw new ForbiddenException('Device is not associated with any home');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isOwner = home.owner.toString() === userId;

    if (path === '/device/:deviceId/remote-open') {
      if (!user.cardNumbers) {
        throw new ForbiddenException('User has no card numbers');
      }

      const hasAccess = await this.deviceService.checkCardAccess(deviceId, user.cardNumbers);
      if (!hasAccess && !isOwner) {
        throw new ForbiddenException('User does not have access to this device');
      }
    } else {
      if (!isOwner) {
        throw new ForbiddenException('Only owner can perform this action');
      }
    }

    request.device = device;
    request.home = home;
    return true;
  }
} 