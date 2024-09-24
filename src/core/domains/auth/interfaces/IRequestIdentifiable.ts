import { Request } from 'express';

export default interface IRequestIdentifiable extends Request {
    id?: string;
}