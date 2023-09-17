import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Article extends Model<Article> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  // @Column({
  //     type: DataType.STRING,
  //     allowNull: false
  // })
  // user: User;
}
