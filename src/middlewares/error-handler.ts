// Library
import type { NextFunction, Request, Response } from 'express';

// App
import { BSResError } from '@common/error/BSResError';
import { log } from '@src/utils';
import { config } from '@src/config';

// Inteface
interface BSErrorResponse {
  message: string;
  errorId?: string;
}

/**
 * Error handler function used in the application when finding an error.
 *
 * @param error
 * @param _req
 * @param res
 * @param _next
 */
/* eslint @typescript-eslint/no-unused-vars: 'off' */
function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof BSResError) {
    log.warn(`Managed exception: ${error.message}`);
    let response: BSErrorResponse = { message: error.message };
    response = error.getErrorId() ? { ...response, errorId: error.getErrorId() } : response;

    res.status(error.getCode()).json(response);
  } else {
    log.error(`Unhandled exception: ${error.message}`, error.stack);

    if (config.NODE_ENV === 'local') {
      res.status(500).json({ message: error.message, stack: error.stack });
    } else {
      res.status(500).json({ message: 'Oops something went wrong!' });
    }
  }
}

export { errorHandler };
