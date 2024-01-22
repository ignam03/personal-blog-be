import { SubComment } from './sub-comment.entity';

export const subCommentProviders = [
  {
    provide: 'SUB_COMMENT_REPOSITORY',
    useValue: SubComment,
  },
];
