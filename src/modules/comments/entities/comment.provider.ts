import { Comment } from './comment.entity';

export const commentProviders = [
  {
    provide: 'COMMENT_REPOSITORY',
    useValue: Comment,
  },
];
