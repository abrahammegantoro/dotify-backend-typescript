import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '@/users/auth/jwt-auth.guard';
import { Public } from '@/users/decorator/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.postsService.create(createPostDto, userId);
    return this.createResponse(result, 'Post created successfully', 201);
  }

  @Get()
  @Public()
  async findAll() {
    const result = await this.postsService.findAll();
    return this.createResponse(result, 'All posts fetched successfully', 200);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.postsService.findOne(id, userId);
    return this.createResponse(result, 'Post fetched successfully', 200);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const result = await this.postsService.update(id, updatePostDto, userId);
    return this.createResponse(result, 'Post updated successfully', 200);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.postsService.remove(id, userId);
    return this.createResponse(result, 'Post deleted successfully', 200);
  }

  private createResponse(data: any, message?: string, statusCode?: number) {
    return {
      message,
      data,
      statusCode,
    };
  }
}
