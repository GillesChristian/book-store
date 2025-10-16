import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { type SaveUser, UsersService } from './users.service';
import { formatResponse } from 'src/utils/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return formatResponse<SaveUser[]>(users ?? []);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    return formatResponse<SaveUser>(user);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    return formatResponse<SaveUser>(user);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    const user = await this.usersService.createUser(data);
    return formatResponse<SaveUser | null>(user ?? null);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: updateUserDto,
  ) {
    const user = await this.usersService.updateUser(id, data);
    return formatResponse<SaveUser | null>(user ?? null);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.deleteUser(id);
    return formatResponse<string>('User deleted successfully');
  }
}
