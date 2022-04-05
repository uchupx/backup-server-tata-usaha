// import { User } from "../db";
import { Router, Request, Response } from "express";
import { Handler } from ".";
import { appRoot } from '../../root'
import * as BackupActions from '../db/actions/backup'
import multer from 'multer'
import fs from 'fs'

export class Backup implements Handler {
  public path = '/backup';
  public backupDir = `${appRoot}/backup_files`
  public router = Router();
  public redis: any
  public uploader: multer.Multer

  constructor(redis: any) {
    this.uploader = multer()
    this.initializeRoutes(redis);
    this.redis = redis
  }

  private initializeRoutes(redis: any) {
    this.router.get(`${this.path}/key`, (req, res) => this.createOtpKey(req, res));
    this.router.post(`${this.path}/upload`, this.uploader.single('backup-file'), (req, res) => this.createBackup(req, res));
    this.router.get(`${this.path}/last`, (req, res) => this.getLastBackup(req, res));
    this.router.get(`${this.path}/ok`, async function getstatus(req, res) {
      res.send('ok')
    });
  }

  private createOtpKey(request: Request, response: Response) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    var result = '';

    for (var i = 0; i < 40; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }

    this.redis.set('otpKey', result, {
      EX: 61
    })

    response.send({
      key: result
    })
  }

  private async createBackup(request: Request, response: Response) {
    const now = new Date()
    const fileName = `/backup-file-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.json`
    const dirName = `/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

    const cacheKey = await this.redis.get('otpKey')

    if (cacheKey && cacheKey == request.body.key) {

      try {
        if (!fs.existsSync(`${this.backupDir}${dirName}`)) {
          fs.mkdirSync(`${this.backupDir}${dirName}`);
        }

        fs.createWriteStream(`${this.backupDir}${dirName}${fileName}`).write(request.file?.buffer)

        BackupActions.insert({
          path: `${this.backupDir}${dirName}${fileName}`,
          dirName: dirName,
          fileName: fileName
        })

      } catch (err) {
        response.status(500).send({
          'result': err
        })
      }

      response.status(200).send({
        'result': 'ok'
      })
    } else {
      response.status(401).send({
        'result': 'invalid key'
      })
    }
  }

  private async getLastBackup(request: Request, response: Response) {
    const result = await BackupActions.findLastBackup()

    console.log(result?.fileName);

    response.download(result!.path)
  }

  public makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }

    return result;
  }
}