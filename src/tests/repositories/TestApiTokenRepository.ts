import ApiTokenRepository from "@src/app/repositories/auth/ApiTokenRepository";
import TestApiTokenModel from "@src/tests/models/models/TestApiTokenModel";


export default class TestApiTokenRepository extends ApiTokenRepository {

    constructor() {
        super()
        this.setModelCtor(TestApiTokenModel)
    }

}