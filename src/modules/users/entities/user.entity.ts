import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { BaseEntity } from 'src/config/base.entity';
import { Article } from 'src/modules/articles/entities/article.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';

@Table({ tableName: 'Users' })
export class User extends BaseEntity<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: ['admin', 'user'],
    allowNull: true,
  })
  role: string;

  @Column({
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: true,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  biography: string;

  @HasMany(() => Article)
  article: Article[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isActive: boolean;

  @HasMany(() => Comment)
  comment: Comment[];
}
