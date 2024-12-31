import { Controller, Post, Body, Param, UseGuards, Get, Request } from '@nestjs/common';
import { HomesService } from './homes.service';
import { HomeDto } from './dto/home.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HomeOwnerGuard } from './guards/home-owner.guard';
import { HomeMemberGuard } from './guards/home-member.guard';

@Controller('homes')
@UseGuards(JwtAuthGuard)
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Post('create')
  async createHome(
    @Body() homeDto: HomeDto,
    @Request() req
  ) {
    return this.homesService.createHome(homeDto, req.user.userId);
  }

  @Post(':homeId/add-device')
  @UseGuards(HomeOwnerGuard)
  async addDeviceToHome(
    @Param('homeId') homeId: string,
    @Body('deviceId') deviceId: string,
    @Request() req
  ) {
    return this.homesService.addDeviceToHome(homeId, deviceId, req.user.userId);
  }

  @Post(':homeId/add-member')
  @UseGuards(HomeOwnerGuard)
  async addMemberToHome(
    @Param('homeId') homeId: string,
    @Body('memberId') memberId: string,
    @Request() req
  ) {
    return this.homesService.addMemberToHome(homeId, memberId, req.user.userId);
  }

  @Get('my-homes')
  async getMyHomes(@Request() req) {
    return this.homesService.getHomesByUser(req.user.userId);
  }

  @Get(':homeId/members')
  @UseGuards(HomeMemberGuard)
  async getHomeMembers(@Param('homeId') homeId: string) {
    return this.homesService.getFamilyMembers(homeId);
  }

  @Get(':homeId/devices')
  @UseGuards(HomeMemberGuard)
  async getHomeDevices(@Param('homeId') homeId: string) {
    return this.homesService.getHomeDevices(homeId);
  }
}
