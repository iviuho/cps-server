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

    return await this.commentRepository.find({
      order: { createdAt: 'DESC' },
      relations: { from: true, to: true },
      skip: offset * limit,
      take: limit,
      where: [
        { to: { uid: query.to }, from: { uid: query.from } },
        { to: { login: query.to }, from: { login: query.from } },
      ],
    });
  }

  async createComment(from_uid: string, to_uid: string, content: string): Promise<Comment> {
    const comment = this.commentRepository.create({
      from: { uid: from_uid },
      to: { uid: to_uid },
      content,
    });

    return await this.commentRepository.save(comment);
  }
}
