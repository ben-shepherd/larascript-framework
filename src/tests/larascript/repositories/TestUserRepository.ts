import UserRepository from "@src/app/repositories/auth/UserRepository";
import TestUser from "@src/tests/larascript/models/models/TestUser";


export default class TestUserRepository extends UserRepository {

    constructor() {
        super()
        this.setModelCtor(TestUser)
    }

}