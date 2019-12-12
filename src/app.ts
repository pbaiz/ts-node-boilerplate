import * as express from 'express';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import * as log4js from 'log4js'
import {RegisterRoutes} from './routes'
import {User} from "./models/User";

const MONGO_URI = `mongodb://localhost:27017/ts-node-bp`;
const DEVELOPMENT_ENV = `development`;

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT_ENV;
log4js.configure('./log4js.json');

class App {
    public express: express.Express;

    public constructor() {
        let logger = log4js.getLogger("App");
        this.express = express();

        this.express.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
        this.express.use(express.json());
        this.express.use(cors());

        logger.info("server started");

        this.connectToMongo(MONGO_URI);

        RegisterRoutes(this.express);

        const swaggerDocument = require('../swagger.json');
        this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        if(process.env.NODE_ENV == DEVELOPMENT_ENV) this.createAdminUser();
    }

    private async connectToMongo(uri: string) {
        try {
            await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            console.info('MongoDB Connected');
        } catch (error) {
            console.error(error);
        }
    }

    private async createAdminUser() {
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
}

export default new App().express;