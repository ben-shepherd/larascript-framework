import User from "@src/app/models/auth/User";
import Repository from "@src/core/base/Repository";
import IUserRepository from "@src/core/domains/auth/interfaces/IUserRepository";

import TestUser from "../models/models/TestUser";

export default class TestUserRepository extends Repository<User> implements IUserRepository {

    constructor() {
        super(TestUser)
    }

    /**
     * Finds a User by their email address
     * @param email 
     * @returns 
     */
    public async findOneByEmail(email: string): Promise<User | null> {
        return await this.findOne({ email })
    }

}