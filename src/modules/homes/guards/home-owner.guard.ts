import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Home } from '../../../database/schema/home.schema';
import { User } from '../../../database/schema/user.schema';

@Injectable()
export class HomeOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Home.name) private homeModel: Model<Home>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const homeId = request.params.homeId;
    const userId = request.user?.userId;

    if (!homeId || !userId) {
      throw new ForbiddenException('Missing required parameters');
    }

    const home = await this.homeModel.findById(homeId);
    if (!home) {
      throw new ForbiddenException('Home not found');
    }

    if (home.owner.toString() !== userId) {
      throw new ForbiddenException('Only home owner can perform this action');
    }

    request.home = home;
    return true;
  }
} 