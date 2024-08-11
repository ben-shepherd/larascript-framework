import Repository from "@src/core/base/Repository";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";
import BaseApiTokenModel from "@src/core/domains/auth/models/BaseApiTokenModel";
import { ModelConstructor } from "@src/core/interfaces/IModel";


export default abstract class BaseApiTokenRepository<Model extends BaseApiTokenModel = BaseApiTokenModel> extends Repository<Model> implements IApiTokenRepository<Model> {

    constructor(collectionName: string = 'apiTokens', modelConstructor: ModelConstructor<Model>) {
        super(collectionName, modelConstructor)
    }

    /**
     * Finds one token
     * @param token 
     * @returns 
     */
    async findOneToken(token: string): Promise<Model | null> {
        return await this.findOne({ token }) as Model
    }

    /**
     * Finds one token that is not currently revoked
     * @param token 
     * @returns 
     */
    async findOneActiveToken(token: string): Promise<Model | null> {
        return await this.findOne({ token, revokedAt: null }) as Model
    }
}