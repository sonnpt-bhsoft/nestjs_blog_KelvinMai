import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { ResponseObject } from 'src/models/response.model';
import { UpdateUserDTO } from 'src/models/user.model';
import { AuthResponse } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard())
  async findCurrentUser(
    @User() { username }: UserEntity,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.findCurrentUser(username);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { username }: UserEntity,
    //reject add unnecessary property not exist in db - new ValidationPipe
    @Body('user', new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ): Promise<ResponseObject<'user', AuthResponse>> {
    const user = await this.authService.updateUser(username, data);
    return { user };
  }
}
