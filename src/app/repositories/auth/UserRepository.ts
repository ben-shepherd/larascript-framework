import User from "@src/app/models/auth/User";
import AuthUserRepository from '@src/core/domains/auth/repository/UserRepository';


export default class UserRepository extends AuthUserRepository {

    constructor() {
        super(User)
    }

}