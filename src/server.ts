// import { RedisClientType } from "@node-redis/client";
import express, { Application, Request, Response } from "express";
import { sequelize } from "./db";
import { client as RedisClient, RedisClientType } from "./db/redis";
import { Handler } from "./handlers";
import { Backup } from "./handlers/backup";
// const app: Application = express();
// const port = 3000;

export class App {
    public app: express.Application
    private redis: RedisClientType

    constructor(handlers: Handler[]) {
        this.app = express()
        this.connectToDatabase()
        this.redis = RedisClient
        // this.connecToRedis()
        this.initializeMiddlewares()
        this.intializeHandler(handlers)
    }

    public listen() {
        this.app.listen(3000, () => {
            console.log(`App listening on the port 3000`);
        });
    }

    private connectToDatabase() {
        sequelize.sync()
    }

    // private connecToRedis() {
    //     const redisConfig = {
    //         socket: {
    //             port: 6379
    //         }
    //     }

    //     const client = createClient(redisConfig);
    //     client.on('error', (err) => console.log('Redis Client Error', err));
    //     client.on('connect', () => console.log('Redis Client connected'));
    //     // client.connect()
    //     // client.set('asd', 'asdasdasdasd')
    //     this.redis = client

    // }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        
            // Pass to next layer of middleware
            next();
        })
    }

    private intializeHandler(handlers: Handler[]) {
        handlers.forEach((handler) => {
            if (handler instanceof Backup) {
                this.app.use('/', handler.router)
            } else {
                this.app.use('/', handler.router)
            }
        })
    }

}
// Body parsing Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get(
//     "/",
//     async (req: Request, res: Response): Promise<Response> => {
//         return res.status(200).send({
//             message: "Hello World!",
//         });
//     }
// );

// try {
//     app.listen(port, (): void => {
//         console.log(`Connected successfully on port ${port}`);
//     });
// } catch (error: any) {
//     console.error(`Error occured: ${error.message}`);
// }