import Repository from "@src/core/base/Repository";
import IApiTokenModel from "@src/core/domains/auth-legacy/interfaces/IApitokenModel";
import IApiTokenRepository from "@src/core/domains/auth-legacy/interfaces/IApiTokenRepository";
import ApiToken from "@src/core/domains/auth/models/ApiToken";


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
        return await this.query().where('token', token).first()
    }

    /**
     * Finds one token that is not currently revoked
     * @param token 
     * @returns 
     */
    async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
        return await this.query().where('token', token).whereNull('revokedAt').first()
    }

}