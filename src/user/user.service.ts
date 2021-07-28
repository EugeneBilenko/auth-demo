import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(createUserDto);
    user.password = await UserService.hashPassword(user.password);

    return user.save();
  }

  async findOne(field: string, value: string): Promise<User> {
    return this.userRepository.findOne({
      where: { [field]: value },
      select: ['password', 'username', 'id'],
    });
  }

  async updatePassword(
    userId: number,
    password: string,
  ): Promise<UpdateResult> {
    password = await UserService.hashPassword(password);
    return this.userRepository.update(userId, { password });
  }

  async checkBy(...args: any[]): Promise<number> {
    return this.userRepository.count({ where: args });
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
