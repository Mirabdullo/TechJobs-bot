import { sequelize } from '../core/db.js'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

interface AdsModel extends Model<InferAttributes<AdsModel>, InferCreationAttributes<AdsModel>> {
  id: CreationOptional<number>
  user_id?: string
  category?: string
  post_id?: string
  tg_link?: string
  name?: string
  age?: string
  phone?: string
  technology?: string
  degree?: string
  work_place?: string
  work_time?: string
  price?: string
  region?: string
  call_time?: string
  info?: string
  elon_state?: string
}
export const Ads = sequelize.define<AdsModel>('ads', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  user_id: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  post_id: { type: DataTypes.STRING, unique: true },
  tg_link: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  age: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  technology: { type: DataTypes.STRING },
  degree: { type: DataTypes.STRING },
  work_place: { type: DataTypes.STRING },
  work_time: { type: DataTypes.STRING },
  price: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  call_time: { type: DataTypes.STRING },
  info: { type: DataTypes.TEXT },
  elon_state: { type: DataTypes.STRING },
})
