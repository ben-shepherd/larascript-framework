import Repository from '../../../base/Repository';
import { IRepository } from '../../../interfaces/IRepository';
import BaseUserModel from '../models/BaseUserModel';
import { BaseUserData } from '../types/types.t';

export default class BaseUserRepositor<M extends BaseUserModel = BaseUserModel, D extends BaseUserData = BaseUserData> extends Repository<BaseUserModel> implements IRepository {

    constructor(model: new (data: D) => M = BaseUserModel as new (data: D) => M) {
        super('users', model);
    }

    async findByEmail(email: string): Promise<M | null> {
        return await this.find({ email }) as M
    }
}