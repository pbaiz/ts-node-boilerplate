import * as express from 'express';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import * as log4js from 'log4js'
import {RegisterRoutes} from './routes'
import {UserRepository} from "./repositories/UserRepository";
import {ServerError} from "./utils";
// import * as i18n from "./i18n";
const i18n = require('./middlewares/i18n');
// import * as i18n from "./i18n";

export const DB_PORT = `27017`;
export const DB_SCHEMA_NAME = `ts-node-bp`;
export const DB_SCHEMA_TEST_NAME = `ts-node-bp-test`;
export const LOCALHOST = `localhost`;
export const DEVELOPMENT_ENV = `development`;
export const TEST_ENV = `test`;

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT_ENV;
process.env.DB_HOST = process.env.DB_HOST || LOCALHOST;

export const MONGO_URI = `mongodb://${process.env.DB_HOST}:${DB_PORT}`;

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
        i18n.initI18n(this.express);
        this.express.get('/ping', (req, res) => {
            return res.send('pong');
        });

        this.defineErrorResponseFormat();

        const swaggerDocument = require('../swagger.json');
        this.express.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private static async createAdminUser() {
        try {
            const admin = await UserRepository.findOne({username: 'admin'});
            if (admin) return;

            const ADMIN = {
                name: 'Admin',
                username: 'admin',
                email: 'admin@email.com',
                roles: ['admin'],
                password: 'admin123'
            };
            await UserRepository.create(ADMIN);
        } catch (error) {
            console.error(error);
        }
    }

    private async connectToMongo() {
        try {
            let schema = process.env.NODE_ENV == TEST_ENV ? DB_SCHEMA_TEST_NAME : DB_SCHEMA_NAME;
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
