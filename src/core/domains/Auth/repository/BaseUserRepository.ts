import Repository from '@src/core/base/Repository';
import IUserRepository from '@src/core/domains/auth/interfaces/IUserRepository';
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';
import { ModelConstructor } from '@src/core/interfaces/IModel';

export default abstract class BaseUserRepository<Model extends BaseUserModel = BaseUserModel> extends Repository<Model> implements IUserRepository<Model>
{
    constructor(collectionName: string = 'users', ctor: ModelConstructor<Model>) {
        super(collectionName, ctor)    
    }

    /**
     * Finds a User by their email address
     * @param email 
     * @returns 
     */
    public async findOneByEmail(email: string): Promise<Model | null> {
        return await this.findOne({ email })
    }
}