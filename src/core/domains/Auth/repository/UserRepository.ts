import Repository from '../../../base/Repository';
import { IRepository } from '../../../interfaces/IRepository';
import UserModel from '../models/UserModel';

export default class UserRepository extends Repository<UserModel> implements IRepository {

    constructor() {
        super('users', UserModel);
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        return await this.find({ email })
    }
}