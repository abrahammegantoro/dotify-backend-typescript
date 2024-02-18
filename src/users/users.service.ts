import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new NotFoundException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== userId) {
      throw new NotFoundException('You are not authorized to update this user');
    }

    return await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: number, userId: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== userId) {
      throw new NotFoundException('You are not authorized to delete this user');
    }

    return await this.usersRepository.remove(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: access_token,
    };
  }
}
