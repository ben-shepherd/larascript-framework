import Repository from "@src/core/base/Repository";
import { ModelConstructor } from "@src/core/interfaces/IModel";

import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import { IUserModel } from "../interfaces/models/IUserModel";
import { IUserRepository } from "../interfaces/repository/IUserRepository";

class UserRepository extends Repository<IUserModel> implements IUserRepository {

    constructor(model: ModelConstructor<IUserModel>) {
        super(model);
    }

    async findById(id: string | number): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).find(id)
    }

    async findByEmail(email: string): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).where('email', email).first()
    }

}

export default UserRepository;


