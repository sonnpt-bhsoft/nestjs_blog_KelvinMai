import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // import for feature UserEntity will allow this module to have access to userEntity
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
