import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[] | null> {
    const users = await this.prisma.user.findMany();

    if (!users) return null;

    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return user;
  }

  async getUserPasswordByEmail(email: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });

    if (!user) return null;

    return user.password;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const userExists = await this.getUserByEmail(data.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.prisma.user.create({
      data,
    });

    return newUser;
  }

  async updateUser(id: string, data: Partial<updateUserDto>): Promise<User> {
    const userExists = await this.getUserById(id);
    if (!userExists) {
      throw new ConflictException('User does not exist');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return updatedUser;
  }
  async deleteUser(id: string): Promise<void> {
    const userExists = await this.getUserById(id);
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
