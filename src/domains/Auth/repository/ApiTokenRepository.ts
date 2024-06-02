import { IRepository } from "../../../interfaces/IRepository";
import BaseRepository from "../../../repositories/BaseRepository";
import ApiTokenModel from "../models/ApiTokenModel";

export default class ApiTokenRepository extends BaseRepository<ApiTokenModel> implements IRepository {

    constructor() {
        super('apiTokens', ApiTokenModel);
    }

    async findByToken(token: string): Promise<ApiTokenModel | null> {
        return await this.find({ token })
    }

    
    async findByUnrevokedToken(token: string): Promise<ApiTokenModel | null> {
        return await this.find({ token, revokedAt: null })
    }
}