import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { TokenService } from 'src/common/service/token';
import { userModel } from 'src/DB/models';
import { UserRepositoryService } from 'src/DB/Repository';

@Module({
    imports: [userModel],
    controllers: [],
    providers: [UserRepositoryService,TokenService,JwtService,FileUploadService],
    exports: [UserRepositoryService,TokenService,JwtService,FileUploadService,userModel]
})
export class GlobalModule {}
