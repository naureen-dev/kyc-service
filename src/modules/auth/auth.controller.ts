import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import CreateUserDto from 'src/database/dtos/create-user.dto';
import { getResponseObject } from 'src/common/untilities/apiResponseUtil';
import LoginDto from 'src/database/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'register a new user'})
  @ApiBody({ type: CreateUserDto })
  async register(@Body() body: CreateUserDto) {
    const response = await this.authService.register(body);
    return getResponseObject(response.data, response.msg);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user', description: 'Log In an existing user' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const response = await this.authService.login(body.email, body.password);
    return getResponseObject(response.data, response.msg);   
  }
}
