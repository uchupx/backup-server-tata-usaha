import {App} from './server';
import {Backup as BackupHandler} from './handlers/backup';
import { createClient } from 'redis'

const redisConfig = {
  socket: {
      port: 6379
  },
}

const client = createClient(redisConfig);
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));
client.connect()

const app = new App(
  [
    new BackupHandler(client),
  ],
);

app.listen();