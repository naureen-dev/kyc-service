import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import CreateUserDto from 'src/database/dtos/create-user.dto';
import PostgresErrorCode from 'src/database/enums/postgresErrorCodes.enum';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // Register a new user
  async register(createUserDto: CreateUserDto) {
    try {
      // Hash user password
      const hashedPassword = await this.userService.hashPassword(createUserDto.password);

      // Check username availability
      const isUsernameTaken = await this.userService.isUsernameTaken(createUserDto.username.toLowerCase());
      if (isUsernameTaken) {
        throw new HttpException('Username Taken', HttpStatus.BAD_REQUEST);
      }

      // Create user
      const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
      await this.userRepository.save(user);

      return { data: user.email, msg: "User Registered Successfully" };
    } catch (error) {
      // Handle known errors
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Email Exists Already!', HttpStatus.BAD_REQUEST);
      }

      // Unknown error
      console.error('Error during user registration:', error);
      throw new HttpException('An unexpected error occurred. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // User login
  async login(email: string, pass: string) {
    try {
      // Check if user exists
      const user = await this.getUserByEmail(email);

      // Compare password
      const passwordMatches = await bcrypt.compareSync(pass, user.password);
      if (!passwordMatches) {
        throw new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
      }

      // Generate access tokens
      const tokens = await this.generateAccessTokens(user.id, user.email, user.role);

      // Return response
      const { password, ...userWithoutPassword } = user;
      return { data: { tokens, user: userWithoutPassword }, msg: "Login Successful" };
    } catch (error) {
      console.error('Error during login:', error);
      throw new HttpException('An unexpected error occurred during login. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw new HttpException('An unexpected error occurred. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Generate access tokens for a user
  async generateAccessTokens(userId: string, userEmail: string, userRole: string) {
    try {
      // Generate tokens
      const tokens = await this.getTokens(userId, userEmail, userRole);
      return tokens;
    } catch (error) {
      console.error('Error generating access tokens:', error);
      throw new HttpException('An error occurred while generating tokens. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Create access tokens
  async getTokens(userId: string, email: string, role: string) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync({ sub: userId, email, role }, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES,
        }),
        this.jwtService.signAsync({ sub: userId, email, role }, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error creating tokens:', error);
      throw new HttpException('An error occurred while creating tokens. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}