import * as express from 'express';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import {RegisterRoutes} from './routes'

const MONGO_URI = `mongodb://localhost:27017/ts-node-bp`;

class App {
    public express: express.Express

    public constructor() {
        this.express = express();
        this.express.use(express.json());
        this.express.use(cors());

        this.connectToMongo(MONGO_URI);

        RegisterRoutes(this.express);

        const swaggerDocument = require('../swagger.json');
        this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    private async connectToMongo(uri: string){
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.info('MongoDB Connected')
            }).catch((err: any) => {
            console.error(err)
        });
    }
}

export default new App().express;