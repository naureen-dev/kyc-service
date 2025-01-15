import { Controller, Body, UseGuards, Get, Patch, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PageOptionsDto } from 'src/database/dtos/common/page-options.dto';
import { getResponseObjectPaginated } from 'src/common/untilities/apiResponseUtil';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { kyc_status, user_role } from '../../database/enums/user.enum';

@Controller('admin')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard) 
export class AdminController {
  constructor(private adminService: AdminService) {}

  // get a list of all users with kyc details
  @Get('kycs')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'get a list of all users with kyc details', description: 'get a list of all users with kyc details'})
  @ApiQuery({ name: 'status', required: false })
  async getAllKyc(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('status') status: string | null = null
  ) {
    const response = await this.adminService.getAllKyc(pageOptionsDto, status);
    return getResponseObjectPaginated(response);
  }

  
  // view details of single kyc submission
  @Get('/kyc/:id')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'view details of single kyc submission', description: 'view details of single kyc submission'})
  getKycById(@Param('id') id: number) {
    return this.adminService.getKycDetailsById(id);
  }

  // update status of a kyc submission
  @Patch('/kyc/:id')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'update status of a kyc submission', description: 'update status of a kyc submission'})
  updateKycStatus(@Param('id') id: number, @Body() body: { status: kyc_status }) {
    return this.adminService.updateKycStatus(id, body.status);
  }


  // get stats data for dashboard
  @Get('dashboard')
  @Roles(user_role.ADMIN)
  async getKycStats() {
    return this.adminService.getKycStats();
  }



  
}

