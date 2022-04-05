import {createClient} from 'redis'

const redisConfig = {
  socket: {
    port: 6379
  }
}

const client = createClient(redisConfig);
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect',() => console.log('Redis Client connected'));
// client.connect()


export { client }
export type RedisClientType = typeof client;