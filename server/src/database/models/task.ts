import { DataTypes, Optional, Model } from 'sequelize';
import { dbConnection } from '..';
import { List } from './list';
import { User } from './user';

interface TaskInstance extends Model {
  id: number;
  user_id: string;
  description: string;
  due_date: Date;
  minutes_to_complete: number;
  is_important: boolean;
  is_complete: boolean;
  completed_at: Date;
  is_public: boolean;
  list_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export const Task = dbConnection.define<TaskInstance>(
  'Task',
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
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    minutes_to_complete: {
      type: DataTypes.INTEGER
      //allowNull: false,
    },
    is_important: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    list_id: {
      type: DataTypes.INTEGER,
      //allowNull: false,
      references: {
        model: List,
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
