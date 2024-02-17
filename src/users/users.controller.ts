import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return this.createResponse(result, 'User created successfully', 201);
  }

  @Get()
  async findAll() {
    const result = await this.usersService.findAll();
    return this.createResponse(result, 'All users fetched successfully', 200);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.usersService.findOne(id);
    return this.createResponse(result, 'User fetched successfully', 200);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);
    return this.createResponse(result, 'User updated successfully', 200);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.usersService.remove(id);
    return this.createResponse(result, 'User deleted successfully', 200);
  }

  private createResponse(data: any, message?: string, statusCode?: number) {
    return {
      message,
      data,
      statusCode,
    };
  }
}
