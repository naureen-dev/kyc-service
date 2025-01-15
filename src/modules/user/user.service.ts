import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Kyc } from 'src/database/entities/kyc.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>
  ) {}

  // Create KYC record for a user
  async createKyc(userId: string, data: { name: string; email: string; documentPath: string }) {
    try {
      const user = await this.getUserById(userId);

      const kyc = this.kycRepository.create({ ...data, user });
      await this.kycRepository.save(kyc);

      return kyc;
    } catch (error) {
      console.error('Error creating KYC:', error);
      throw new HttpException('An error occurred while creating the KYC. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get a list of all KYC records for a specific user
  async getKycByUser(userId: string) {
    try {
      console.log(userId)
      // Fetch KYC records for a specific user, excluding password from the user relation
      const kycRecords = await this.kycRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        select: ['id', 'name', 'email', 'documentPath', 'status', 'created_at'], // KYC fields to select
      });
  
      // If no KYC records are found, throw an exception
      if (!kycRecords || kycRecords.length === 0) {
        throw new HttpException('No KYC records found for this user', HttpStatus.NOT_FOUND);
      }
  
      // Return KYC records
      return kycRecords;
    } catch (error) {
      console.error('Error fetching KYC records for user:', error);
      throw new HttpException('An error occurred while fetching KYC records. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hashSync(password, 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new HttpException('An error occurred while hashing the password. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Check if a username exists
  async isUsernameTaken(username: string): Promise<boolean> {
    try {
      const userExists = await this.userRepository.findOne({ where: { username } });
      return !!userExists;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw new HttpException('An error occurred while checking username availability. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // helper function
  async getUserById(id: string): Promise<User> {
    try {
      // Fetch user by ID excluding the password field
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'username', 'role', 'created_at'], 
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(`Error fetching user by ID ${id}:`, error);
      throw new HttpException('Unable to fetch user details. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}