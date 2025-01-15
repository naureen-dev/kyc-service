import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import { user_role } from '../enums/user.enum';

export class UserDto {
  @IsString()
  @ApiProperty({ example: 'Naureen Sheikh' })
  full_name: string;

  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  @MaxLength(20, { message: 'Username is too long' })
  @Matches(/^[a-zA-Z0-9_\-\.]+$/, { message: 'Invalid characters in username' })
  @ApiProperty({ example: 'naureen_sheikh' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'dev.naureen@gmail.com' })
  email: string;

  @IsEnum(user_role)
  @ApiProperty({ example: user_role.USER })
  role: user_role;

  @ApiHideProperty()
  refresh_token: string;
}

export default UserDto;
