import * as express from 'express';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from './routes'

class App {
    public express: express.Express
  
    public constructor () {
      this.express = express();
      this.express.use(express.json());
      this.express.use(cors());

      mongoose.connect(`mongodb://localhost:27017/ts-node-bp`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.info('MongoDB Connected')
      }).catch((err: any) => {
        console.error(err)
      });

      RegisterRoutes(this.express);
      
      const swaggerDocument = require('../swagger.json');
      this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }
}

export default new App().express;