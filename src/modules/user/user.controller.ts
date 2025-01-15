import { Controller, Post, Body, UseInterceptors, UploadedFile, Req, UseGuards, Get, Patch, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        document: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const userId = req.user['sub'];
          const dir = `./uploads/${userId}`;
          mkdirSync(dir, { recursive: true });
          callback(null, dir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf|jpeg|png)$/)) {
          return callback(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async submitKyc(
    @Req() req: Request,
    @Body() body: { name: string; email: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = req.user['sub']; // Get logged-in user's ID
      const documentPath = file.path;
      return await this.userService.createKyc(userId, { ...body, documentPath });
    } catch (error) {
      throw new BadRequestException('Failed to process the KYC request.');
    }
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
