import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CommentService } from './comment.service';
import { CommentQuery, Pagination } from './comment.interface';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getCommentsByQuery(@Query() query: any) {
    const { to, from }: CommentQuery = query;
    const { offset, limit }: Pagination = query;

    return await this.commentService.getCommentsByUser(
      { to, from },
      { offset, limit }
    );
  }
}
