import { DataTypes, Optional, Model } from 'sequelize';
import { dbConnection } from '..';

export interface UserInstance extends Model {
  id: string;
  username: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
  level: number;
  readable_font: boolean;
}

export const User = dbConnection.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    readable_font: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    timestamps: true
  }
);
