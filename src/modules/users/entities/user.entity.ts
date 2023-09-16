import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { Article } from 'src/modules/articles/entities/article.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  birthDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: ['admin', 'user'],
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: false,
  })
  gender: string;

  //@Column
  //articles: Article[];

  @Column({ defaultValue: false })
  isActive: boolean;
}
