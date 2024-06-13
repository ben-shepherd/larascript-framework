import { UserData } from "@src/app/interfaces/auth/UserData";
import User from "@src/app/models/auth/User";
import BaseUserRepository from "@src/core/domains/auth/repository/BaseUserRepository";

export default class UserRepository extends BaseUserRepository<User, UserData> {

    constructor() {
        super(User);
    }
}