// import { remote } from "electron";
import path from 'path';
import User from './models/user'
import BackupHistory from './models/backup_history'
import { DataTypes, Sequelize, OperatorsAliases } from 'sequelize';
import {config as dbConfig} from './db.config'

declare const __static: string;

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'mysql',
    // operatorsAliases: ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'users',
    sequelize
})
User.sync()

BackupHistory.init({
    path: { type: DataTypes.STRING, allowNull: false },
    dirName: { type: DataTypes.STRING, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
}, {
    tableName: 'backup_histories',
    sequelize
})
BackupHistory.sync()

export { sequelize, User, BackupHistory };
