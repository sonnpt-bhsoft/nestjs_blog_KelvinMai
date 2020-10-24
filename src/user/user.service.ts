import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { username } });
  }

  async updateUser(username: string, data) {
    await this.userRepo.update({ username }, data);
    return this.findByUsername(username);
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
    user.followers = user.followers.filter(follower => follower !== currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }
}
