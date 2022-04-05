import { Model } from 'sequelize'

export = class User extends Model {
  public id!: string;
  public name!: string;
  public password!: string;
  public email!: string;
  // public name?: string;
  // public name?: string;
}