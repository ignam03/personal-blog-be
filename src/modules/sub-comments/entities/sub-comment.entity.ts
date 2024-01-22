import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseEntity } from 'src/config/base.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';

@Table({ tableName: 'SubComment' })
export class SubComment extends BaseEntity<SubComment> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  content: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.INTEGER,
    field: 'commentId',
    allowNull: false,
  })
  commentId: number;

  @Column({
    type: DataType.INTEGER,
    field: 'authorId',
    allowNull: false,
  })
  authorId: number;
}
