import { sequelize } from '../core/db.js'
import { DataTypes } from 'sequelize'
export const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  user_id: { type: DataTypes.STRING, unique: true },
  phone_number: { type: DataTypes.STRING },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  username: { type: DataTypes.STRING },
  last_state: { type: DataTypes.STRING },
  user_lang: { type: DataTypes.STRING },
  tg_link: { type: DataTypes.STRING },
})
