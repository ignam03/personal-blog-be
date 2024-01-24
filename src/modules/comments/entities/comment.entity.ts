import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseEntity } from 'src/config/base.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table({ tableName: 'Comments' })
export class Comment extends BaseEntity<Comment> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentCommentId: number;

  @BelongsTo(() => Article)
  article: Article;

  @BelongsTo(() => User)
  author: User;
}
