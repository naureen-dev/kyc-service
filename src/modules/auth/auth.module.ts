import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../../database/entities/user.entity';
import { AccessTokenStrategy } from '../../common/strategies/accessToken.strategy';
import { UserService } from '../user/user.service';
import { Kyc } from 'src/database/entities/kyc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Kyc]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),
  ],
  providers: [AuthService, AccessTokenStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
