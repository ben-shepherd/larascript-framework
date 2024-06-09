import Repository from '../../../base/Repository';
import { IRepository } from '../../../interfaces/IRepository';
import BaseUserModel from '../models/BaseUserModel';
import { BaseUserData } from '../types/types.t';

type Constructor<M,D> = new (data: D) => M

export default class BaseUserRepository<
    M extends BaseUserModel = BaseUserModel,
    D extends BaseUserData = BaseUserData
> extends Repository<M> implements IRepository 
{

    constructor(model: Constructor<M,D> = BaseUserModel as Constructor<M,D>) {
        super('users', model);
    }

    async findByEmail(email: string): Promise<M | null> {
        return await this.findOne({ email }) as M
    }
}