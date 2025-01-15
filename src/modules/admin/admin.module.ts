import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../../database/entities/user.entity';
import { Kyc } from 'src/database/entities/kyc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Kyc]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
