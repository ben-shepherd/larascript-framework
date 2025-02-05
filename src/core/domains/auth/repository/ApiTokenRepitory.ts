import Repository from "@src/core/base/Repository";
import { ModelConstructor } from "@src/core/interfaces/IModel";

import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import { IApiTokenModel } from "../interfaces/models/IApiTokenModel";
import { IApiTokenRepository } from "../interfaces/repository/IApiTokenRepository";
import ApiToken from "../models/ApiToken";

class ApiTokenRepository extends Repository<IApiTokenModel> implements IApiTokenRepository {

    constructor(modelConstructor: ModelConstructor<IApiTokenModel> = ApiToken) {
        super(modelConstructor)
    }

    /**
     * Find one active token
     * @param token 
     * @returns 
     */

    async findOneActiveToken(token: string): Promise<IApiTokenModel | null> {
        const builder = queryBuilder(this.modelConstructor)

        builder.where('token', token)
        builder.whereNull('revokedAt')

        return await builder.first()
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
        await queryBuilder(this.modelConstructor)
            .where('id', apiToken.id as string)
            .update({ revokedAt: new Date() });
    }


    /**
     * Revokes all tokens for a user
     * @param userId 
     * @returns 
     */
    async revokeAllTokens(userId: string | number): Promise<void> {
        await queryBuilder(this.modelConstructor)
            .where('userId', userId)
            .update({ revokedAt: new Date() });
    }

    
    

}

export default ApiTokenRepository;


