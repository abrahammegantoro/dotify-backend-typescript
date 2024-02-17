import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const result = await this.postsService.create(createPostDto);
    return this.createResponse(result, 'Post created successfully', 201);
  }

  @Get()
  async findAll() {
    const result = await this.postsService.findAll();
    return this.createResponse(result, 'All posts fetched successfully', 200);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.postsService.findOne(id);
    return this.createResponse(result, 'Post fetched successfully', 200);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    const result = await this.postsService.update(id, updatePostDto);
    return this.createResponse(result, 'Post updated successfully', 200);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.postsService.remove(id);
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
