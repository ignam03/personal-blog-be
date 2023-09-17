import { Column, DataType, Model } from 'sequelize-typescript';

export class BaseEntity<T> extends Model<T> {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT,
  })
  id: number;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
