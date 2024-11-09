import ApiToken from "@src/app/models/auth/ApiToken";
import Repository from "@src/core/base/Repository";
import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";


export default class ApiTokenRepository extends Repository<IApiTokenModel> implements IApiTokenRepository {

    constructor() {
        super(ApiToken)
    }

    /**
     * Finds one token
     * @param token 
     * @returns 
     */
    async findOneToken(token: string): Promise<IApiTokenModel | null> {
        return await this.findOne({ token })
    }

    /**
     * Finds one token that is not currently revoked
     * @param token 
     * @returns 
     */
    async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
        return await this.findOne({ token, revokedAt: null })
    }

}