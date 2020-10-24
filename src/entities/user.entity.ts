import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: null, nullable: true })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @ManyToMany(
    type => UserEntity,
    user => user.followee,
  )
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.followers,
  )
  followee: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);
    const profile: any = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
