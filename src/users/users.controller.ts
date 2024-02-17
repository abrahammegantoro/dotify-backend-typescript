import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './decorator/public.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return this.createResponse(result, 'User created successfully', 201);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const result = await this.usersService.findAll();
    return this.createResponse(result, 'All users fetched successfully', 200);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    const result = await this.usersService.findOne(id);
    return this.createResponse(result, 'User fetched successfully', 200);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(id, updateUserDto);
    return this.createResponse(result, 'User updated successfully', 200);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    const result = await this.usersService.remove(id);
    return this.createResponse(result, 'User deleted successfully', 200);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.usersService.login(loginUserDto);
    return this.createResponse(result, 'User logged in successfully', 200);
  }

  private createResponse(data: any, message?: string, statusCode?: number) {
    return {
      message,
      data,
      statusCode,
    };
  }
}
