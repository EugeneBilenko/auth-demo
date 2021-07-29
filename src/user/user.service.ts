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

  async findOne(conditions: Partial<User>, password = false): Promise<User> {
    return this.userRepository.findOne({
      where: conditions,
      ...(password ? { select: ['username', 'password', 'email', 'id'] } : {}),
    });
  }

  async updatePassword(
    userId: number,
    password: string,
  ): Promise<UpdateResult> {
    const newPassword = await UserService.hashPassword(password);
    return this.userRepository.update(userId, { password: newPassword });
  }

  async checkIfExists(...conditions: Array<Partial<User>>): Promise<number> {
    return this.userRepository.count({ where: conditions });
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
