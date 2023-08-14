export interface CommentQuery {
  to?: string;
  from?: string;
}

export interface Pagination {
  offset?: number;
  limit?: number;
}
