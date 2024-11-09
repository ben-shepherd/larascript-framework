import ApiToken from "@src/app/models/auth/ApiToken";
import Repository from "@src/core/base/Repository";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";

import TestApiTokenModel from "../models/models/TestApiTokenModel";


export default class TestApiTokenRepository extends Repository<ApiToken> implements IApiTokenRepository {

    constructor() {
        super(TestApiTokenModel)
    }

    /**
     * Finds one token
     * @param token 
     * @returns 
     */
    async findOneToken(token: string): Promise<ApiToken | null> {
        return await this.findOne({ token })
    }

    /**
     * Finds one token that is not currently revoked
     * @param token 
     * @returns 
     */
    async findOneActiveToken(token: string): Promise<ApiToken | null> {
        return await this.findOne({ token, revokedAt: null })
    }

}