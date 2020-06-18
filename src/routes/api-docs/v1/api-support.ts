// Library
import type { NextFunction, Request, Response } from 'express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

function prepareSwaggerDoc(req: Request & {swaggerDoc: any}, res: Response, next: NextFunction) {
  const swaggerYMLStr = fs.readFileSync(path.resolve('docs/swagger.yml'));
  const currentHost = `${req.protocol}://${req.get('host')}`;
  const swaggerYMLResolvedStr = swaggerYMLStr.toString().replace(/{schemaHost}/g, currentHost);
  const swaggerDocument = YAML.parse(swaggerYMLResolvedStr);
  req.swaggerDoc = swaggerDocument;
  next();
}

// Export
export { prepareSwaggerDoc };
