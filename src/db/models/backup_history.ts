import { Model } from "sequelize";

export = class BackupHistory extends Model{
  public id!: number | null;
  public path!: string;
  public dirName!: string;
  public fileName!: string;
  public createdAt!: Date;
}
