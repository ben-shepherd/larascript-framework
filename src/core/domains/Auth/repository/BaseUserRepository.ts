import Repository from '@src/core/base/Repository';
import { ModelConstructor } from '@src/core/interfaces/IModel';
import IUserRepository from '../interfaces/IUserRepository';
import BaseUserModel from '../models/BaseUserModel';

export default abstract class BaseUserRepository<Model extends BaseUserModel = BaseUserModel> extends Repository<Model> implements IUserRepository 
{
    constructor(collectionName: string = 'users', ctor: ModelConstructor<Model>) {
        super(collectionName, ctor)    
    }

    async findByEmail(email: string): Promise<Model | null> {
        return await this.findOne({ email }) as Model
    }
}