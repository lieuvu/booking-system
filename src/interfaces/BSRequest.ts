import { Request } from 'express';

export interface BSRequest extends Request {
    services: any;
}
