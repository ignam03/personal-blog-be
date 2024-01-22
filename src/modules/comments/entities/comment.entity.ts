import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from 'src/config/base.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { SubComment } from 'src/modules/sub-comments/entities/sub-comment.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table({ tableName: 'ArticleComment' })
export class Comment extends BaseEntity<Comment> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentCommentId: number;

  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    field: 'articleId',
    allowNull: false,
  })
  articleId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'authorId',
    allowNull: false,
  })
  authorId: number;

  @HasMany(() => SubComment)
  subComments: SubComment[];
}
