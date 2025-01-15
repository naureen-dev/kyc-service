import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kyc } from 'src/database/entities/kyc.entity';
import { User } from 'src/database/entities/user.entity';
import { PageOptionsDto } from 'src/database/dtos/common/page-options.dto';
import { PageDto } from 'src/database/dtos/common/page.dto';
import { PageMetaDto } from 'src/database/dtos/common/page-meta.dto';
import { kyc_status, user_role } from 'src/database/enums/user.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Kyc) private kycRepository: Repository<Kyc>
  ) {}

  // get a list of all kyc
  async getAllKyc(pageOptionsDto: PageOptionsDto, status: string): Promise<PageDto<Kyc>> {
    try {
      // query builder
      const queryBuilder = this.kycRepository.createQueryBuilder('Kyc');

      // Join related user entity 
      queryBuilder
        .leftJoinAndSelect('Kyc.user', 'user')
        .select([
          'Kyc.id', 'Kyc.name', 'Kyc.email', 'Kyc.documentPath', 'Kyc.status', 'Kyc.created_at',
          'user.id', 'user.email', 'user.username', 'user.role', 'user.created_at' 
        ])
        .orderBy('Kyc.created_at', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.limit);

      // Add a category filter if a category is provided
      if (status) {
        queryBuilder.andWhere('Kyc.status = :status', { status });
      }

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      console.error('Error fetching KYC records:', error);
      throw new HttpException('Unable to fetch KYC records. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



// get KYC details by id
async getKycDetailsById(id: number): Promise<Kyc> {
  return await this.getKycByIdQuery(id);
}

// update KYC status
async updateKycStatus(id: number, status: kyc_status) {
  try {
    const kyc = await this.getKycByIdQuery(id); // Reusing the helper function

    kyc.status = status;
    return this.kycRepository.save(kyc);
  } catch (error) {
    console.error(`Error updating KYC status for ID ${id}:`, error);
    throw new HttpException('Unable to update KYC status. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  // get dashboard stats 
  async getKycStats(): Promise<any> {
    try {
      const totalUsers = await this.userRepository.count({ where: { role: user_role.USER } });
      const approvedKycs = await this.kycRepository.count({ where: { status: kyc_status.APPROVED } });
      const pendingKycs = await this.kycRepository.count({ where: { status: kyc_status.PENDING } });
      const rejectedKycs = await this.kycRepository.count({ where: { status: kyc_status.REJECTED } });

      return {
        totalUsers,
        approvedKycs,
        pendingKycs,
        rejectedKycs,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new HttpException('Unable to fetch statistics. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // Helper function to get KYC by ID
async getKycByIdQuery(id: number): Promise<Kyc> {
  try {
    const kyc = await this.kycRepository.createQueryBuilder('Kyc')
      .leftJoinAndSelect('Kyc.user', 'user')
      .select([
        'Kyc.id', 'Kyc.name', 'Kyc.email', 'Kyc.documentPath', 'Kyc.status', 'Kyc.created_at',
        'user.id', 'user.email', 'user.username', 'user.role', 'user.created_at' 
      ])
      .where('Kyc.id = :id', { id })
      .getOne();

    if (!kyc) {
      throw new NotFoundException(`KYC submission with ID ${id} not found`);
    }

    return kyc;
  } catch (error) {
    console.error(`Error fetching KYC record by ID ${id}:`, error);
    throw new HttpException('Unable to fetch KYC details. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}