import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@src/entity/comment';

import { CommentQuery, Pagination } from './comment.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async getCommentsByUser(query: CommentQuery, pagination: Pagination) {
    if (!query.to && !query.from) {
      throw Error('get comments query not found');
    }

    const { offset = 0, limit = 20 } = pagination;

    return this.commentRepository.find({
      order: { createdAt: 'DESC' },
      relations: { from: true, to: true },
      skip: offset * limit,
      take: limit,
      where: { to: { login: query.to }, from: { login: query.from } },
    });
  }
}
