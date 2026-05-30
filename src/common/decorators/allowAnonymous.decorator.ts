import { SetMetadata } from '@nestjs/common';
import { DECORATOR } from './decorator.enum';

export const Public = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(DECORATOR.IS_PUBLIC, true);
