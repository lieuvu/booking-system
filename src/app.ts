// Library
import express from 'express';
import morganBody from 'morgan-body';
import queryString from 'query-string';
import path from 'path';

// App
import { config } from '@src/config';
import { apiRoute } from '@routes/api';
import { apiDocsRoute } from '@routes/api-docs';
import { errorHandler } from '@src/middlewares/error-handler';

// Setup app
const app = express();
app.set('query parser', str => {
  return queryString.parse(str, { parseNumbers: true, parseBooleans: true });
});
app.use(express.json());

// Setup morgan body
switch (config.NODE_ENV) {
  case 'development':
    morganBody(app, {
      theme: 'lightened',
      logResponseBody: true,
    });
    break;
  case 'test':
    if (config.MORGAN_LOG_REQUEST_ENABLED === 'true' || config.MORGAN_LOG_REQUEST_ENABLED === true) {
      morganBody(app, {
        theme: 'lightened',
        logResponseBody: true,
      });
    }
    break;
  default:
    morganBody(app, {
      noColors: true,
      logResponseBody: false
    });
}

// Setup router
const rootRouter = express.Router();

// Routes
app.use('/', rootRouter);
app.use('/api', apiRoute);
app.use('/api-docs/schemas', express.static(path.resolve('src/schemas')));
app.use('/api-docs', apiDocsRoute);
app.use(errorHandler);

// Export
export { app };
