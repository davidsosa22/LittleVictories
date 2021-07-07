import { DataTypes, Model } from 'sequelize';
import { dbConnection } from '..';
import { User } from './user';
import { Task } from './task';

export interface LikeInstance extends Model {
  id: number;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Like = dbConnection.define<LikeInstance>(
  'Like',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Task,
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);
