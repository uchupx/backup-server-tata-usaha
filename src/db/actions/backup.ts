import { BackupHistory, sequelize } from '../index'

export interface NewBackupHistory {
  path: string;
  dirName: string;
  fileName: string;
  createdAt?: Date;
  id?: number | null;
}

const insert = async (data: NewBackupHistory) => {
  data.createdAt = new Date
  
  const newData = await BackupHistory.create({
    path: data.path,
    dirName: data.dirName,
    fileName: data.fileName,
    createdAt: data.createdAt,
  })

  return newData.id
}

const findLastBackup = async () => {
  const result = await BackupHistory.findOne({order: [['id', 'desc']]})
  return result
}

export { insert, findLastBackup }