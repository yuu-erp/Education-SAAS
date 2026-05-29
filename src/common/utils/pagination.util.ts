import {
  PaginationMeta,
  PaginationOptions,
} from '../interfaces/pagination.interface';

export function createPaginationMeta(
  options: PaginationOptions,
  totalItems: number,
): PaginationMeta {
  const { page, limit } = options;
  const pageCount = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    itemCount: totalItems,
    pageCount,
    hasPreviousPage: page > 1,
    hasNextPage: page < pageCount,
  };
}
