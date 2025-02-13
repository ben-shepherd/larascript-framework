import ApiTokenRepository from "@src/core/domains/auth/repository/ApiTokenRepitory";
import TestApiTokenModel from "@src/tests/models/models/TestApiTokenModel";


export default class TestApiTokenRepository extends ApiTokenRepository {

    constructor() {
        super()
        this.setModelCtor(TestApiTokenModel)
    }

}