import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { Article } from 'src/modules/articles/entities/article.entity';

@Table
export class User extends Model<User> {

  
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

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
    allowNull: false,
  })
  email: string;

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

  //@Column
  //articles: Article[];

  @Column({ defaultValue: false })
  isActive: boolean;
}
