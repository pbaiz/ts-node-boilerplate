import * as express from 'express';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import * as log4js from 'log4js'
import {RegisterRoutes} from './routes'
import {User} from "./models/User";
import {ServerError} from "./utils";

export const MONGO_URI = `mongodb://localhost:27017`;
const SCHEMA_NAME = `ts-node-bp`;
export const SCHEMA_TEST_NAME = `ts-node-bp-test`;
export const DEVELOPMENT_ENV = `development`;
export const TEST_ENV = `test`;

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT_ENV;

log4js.configure('./log4js.json');

class App {
    public express: express.Express;
    private logger = log4js.getLogger("App");

    public constructor() {
        this.express = express();

        this.express.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));
        this.express.use(express.json());
        this.express.use(cors());

        this.logger.info("server started");

        this.connectToMongo();

        RegisterRoutes(this.express);
        this.express.get('/ping', (req, res) => {
            return res.send('pong');
        });

        this.defineErrorResponseFormat();

        const swaggerDocument = require('../swagger.json');
        this.express.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private static async createAdminUser() {
        try {
            const admin = await User.findOne({username: 'admin'});
            if (admin) return;

            const ADMIN = {
                name: 'Admin',
                username: 'admin',
                email: 'admin@email.com',
                roles: ['admin'],
                password: 'admin123'
            };
            await User.create(ADMIN);
        } catch (error) {
            console.error(error);
        }
    }

    private async connectToMongo() {
        try {
            let schema = process.env.NODE_ENV == TEST_ENV ? SCHEMA_TEST_NAME : SCHEMA_NAME;
            let uri = `${MONGO_URI}/${schema}`;
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            console.info('MongoDB Connected');
            if (process.env.NODE_ENV == DEVELOPMENT_ENV) App.createAdminUser();
        } catch (error) {
            console.error(error);
            this.logger.info("server started");
        }
    }

    private defineErrorResponseFormat() {
        this.express.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
            const body: ServerError = {
                status: err.status || 500,
                internalServerErrors: err.internalServerErrors
            };
            res.status(body.status).json(body);
            next();
        });
    }
}

export default new App().express;
