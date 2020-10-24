import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from 'src/models/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(
    username: string,
    user?: UserEntity,
  ): Promise<UserEntity> {
    return (
      await this.userRepo.findOne({
        where: { username },
        relations: ['followers'],
      })
    ).toProfile(user);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const profile = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    profile.followers.push(currentUser);
    await profile.save();
    return profile.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers = user.followers.filter(
      follower => follower !== currentUser,
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
