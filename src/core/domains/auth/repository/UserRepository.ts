import Repository from "@src/core/base/Repository";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { IUserRepository } from "@src/core/domains/auth/interfaces/repository/IUserRepository";
import AuthUser from "@src/core/domains/auth/models/AuthUser";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { ModelConstructor } from "@src/core/interfaces/IModel";

class UserRepository extends Repository<IUserModel> implements IUserRepository {

    constructor(userModel?: ModelConstructor<IUserModel>) {
        super(userModel ?? AuthUser);
    }

    create(attributes: IUserModel | null = null): IUserModel {
        return this.modelConstructor.create(attributes)
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


