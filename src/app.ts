// Library
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morganBody from 'morgan-body';

// Typescript
import { BSRequest } from '@src/interfaces/BSRequest'
import { services } from '@src/services';
import { apiRoute } from '@src/routes/api'
import { log } from '@util/logger';

// Environment
const env = process.env;

// Setup app
const app = express();
app.use(bodyParser.json());
morganBody(app, {
  noColors: env.NODE_ENV !== 'development',
  theme: 'lightened',
  logResponseBody: false
});

// Setup router
const rootRouter = express.Router();

// Route
app.use('/', rootRouter)
app.use((req: BSRequest, res: express.Response, next: express.NextFunction) => {
  log.info('Setup servivces');
  req.services = services;
  next();
})
app.use('/api', apiRoute);

// Export
export { app };
