// Library
import Ajv from 'ajv';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

// App
import { BSError } from '@common/error/BSError';
import { BSResBadRequestError, BSResSystemError } from '@common/error/BSResError';
import { log } from '@src/utils';

/**
 * Validate the json data of a request body.
 *
 * @param schemaFiles The array of schema files to validate the request body.
 */
function validateRequestBody(schemaFiles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      log.info('Validating request body...');
      const schemas = schemaFiles.map(schemaFile => require(schemaFile));
      const ajv = new Ajv({ schemas }).compile(schemas.pop());

      // Continue the request if the schema validation successful
      if (ajv(req.body) === true) {
        log.info('Validated request body successfully!');
        return next();
      }

      // Otherwise, the schema validation failed
      if (ajv.errors?.length > 0) {
        log.error(`Failed to validate request body: ${JSON.stringify(ajv.errors)}`);
        throw new BSError('Invalid request body!');
      }

    } catch (error) {
      if (error instanceof BSError) {
        return next(new BSResBadRequestError('Invalid request body!'));
      }

      log.error(`Can not validate schema files ${JSON.stringify(schemaFiles)}: ${error.message}`);
      return next(new BSResSystemError('Can not process request!'));
    }
  };
}

// Export
export { validateRequestBody };
