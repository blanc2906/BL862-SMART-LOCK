import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomesService } from './homes.service';
import { HomesController } from './homes.controller';
import { Home, HomeChema } from 'src/database/schema/home.schema';
import { User, UserSchema } from 'src/database/schema/user.schema';
import { Device, DeviceSchema } from 'src/database/schema/device.schema';
import { DeviceModule } from '../device/device.module';
import { UsersModule } from '../users/users.module';
import { HomeOwnerGuard } from './guards/home-owner.guard';
import { HomeMemberGuard } from './guards/home-member.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Home.name, schema: HomeChema },
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema }
    ]),
    DeviceModule,
    UsersModule
  ],
  controllers: [HomesController],
  providers: [
    HomesService,
    HomeOwnerGuard,
    HomeMemberGuard
  ],
  exports: [HomesService]
})
export class HomesModule {}
