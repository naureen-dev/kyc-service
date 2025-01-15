import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../database/entities/user.entity';
import { Kyc } from 'src/database/entities/kyc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Kyc]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
