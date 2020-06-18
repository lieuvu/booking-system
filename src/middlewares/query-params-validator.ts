// Library
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import Ajv from 'ajv';

// App
import { BSError } from '@common/error/BSError';
import { BSResBadRequestError, BSResSystemError } from '@common/error/BSResError';
import { log } from '@src/utils';

/**
 * Validate the json data of a request query params.
 *
 * @param schemaFile The sechema file to validate the request query params.
 */
/* eslint @typescript-eslint/no-var-requires: "off" */
function validateQueryParams(schemaFile: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      log.info('Validating request query params...');
      const schema = require(schemaFile);
      const ajv = new Ajv().compile(schema);

      // Continue the request if the schema validation successful
      if (ajv(req.query) === true) {
        log.info('Validated request query params successfully!');
        return next();
      }

      // Otherwise, the schema validation failed
      if (ajv.errors?.length > 0) {
        log.error(`Failed to validate request query params: ${JSON.stringify(ajv.errors)}`);
        throw new BSError('Invalid request query params!');
      }

    } catch (error) {
      if (error instanceof BSError) {
        return next(new BSResBadRequestError('Invalid request query params!'));
      }

      log.error(`Can not validate schema files ${JSON.stringify(schemaFile)}: ${error.message}`);
      return next(new BSResSystemError('Can not process request!'));
    }
  };
}

// Export
export { validateQueryParams };
