import Repository from "@src/core/base/Repository";

import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import { IUserModel } from "../interfaces/models/IUserModel";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import AuthUser from "../models/AuthUser";

class UserRepository extends Repository<IUserModel> implements IUserRepository {

    constructor() {
        super(AuthUser);
    }

    async findById(id: string | number): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).find(id)
    }

    async findByIdOrFail(id: string | number): Promise<IUserModel> {
        return await queryBuilder(this.modelConstructor).findOrFail(id)
    }

    async findByEmail(email: string): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).where('email', email).first()
    }

}

export default UserRepository;


