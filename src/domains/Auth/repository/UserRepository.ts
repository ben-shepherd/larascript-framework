import { IRepository } from "../../../interfaces/IRepository";
import BaseRepository from "../../../repositories/BaseRepository";
import UserModel from "../models/UserModel";

export default class UserRepository extends BaseRepository<UserModel> implements IRepository {

    constructor() {
        super('users', UserModel);
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        return await this.find({ email })
    }
}