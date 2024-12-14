import User from "@src/app/models/auth/User";
import Repository from "@src/core/base/Repository";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import IUserRepository from "@src/core/domains/auth/interfaces/IUserRepository";

export default class UserRepository extends Repository<IUserModel> implements IUserRepository {

    constructor() {
        super(User)
    }
    
    /**
     * Finds a User by their email address
     * @param email 
     * @returns 
     */
    public async findOneByEmail(email: string): Promise<IUserModel | null> {
        return this.query().select('id').where('email', email).first()
    }

}