import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {

  @IsEmail()
  @ApiProperty({ example: 'dev.naureen@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;

}

export default LoginDto;