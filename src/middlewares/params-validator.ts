// Library
import type { NextFunction, Request, Response } from 'express';

// App
import { BSResBadInputError } from '@common/error/BSResError';

/**
 * Validate id string in the request params.
 *
 * @param req
 * @param res
 * @param next
 */
function validateId(req: Request, _res: Response, next: NextFunction): void {
  const { id } = req.params;
  const idInt = Number.parseInt(id, 10);

  if (!Number.isInteger(idInt) || idInt < 1) {
    throw new BSResBadInputError(`The param id [${id}] is not strictly positive integer!`);
  }

  next();
}

// Export
export { validateId };
