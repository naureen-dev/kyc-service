import { Controller, Post, Body, UseInterceptors, UploadedFile, Req, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { user_role } from 'src/database/enums/user.enum';

@Controller('user')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard) 
export class UserController {
  constructor(private userService: UserService) {}

  
  // create a new kyc request
  @Post('kyc')
  @Roles(user_role.USER)
  @ApiOperation({ summary: 'create a new kyc request', description: 'create a new kyc request'})
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  submitKyc(
    @Req() req: Request,
    @Body() body: { name: string; email: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user_id = req.user['sub']; // get logged in user's ID
    const documentPath = file.path;
    return this.userService.createKyc(user_id, { ...body, documentPath });
  }


  // get a list of kyc specific to user
  @Get('my-kycs')
  @Roles(user_role.USER)
  @ApiOperation({ summary: 'get a list of kyc specific to user', description: 'get a list of kyc specific to user'})
  getMyKycs(@Req() req: Request) {
    const user_id = req.user['sub']; // get logged in user's ID
    return this.userService.getKycByUser(user_id);
  }



  
}
