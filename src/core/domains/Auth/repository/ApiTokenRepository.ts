import Repository from "../../../base/Repository";
import { IRepository } from "../../../interfaces/IRepository";
import ApiTokenModel from "../models/ApiTokenModel";

export default class ApiTokenRepository extends Repository<ApiTokenModel> implements IRepository {

    constructor() {
        super('apiTokens', ApiTokenModel);
    }

    async findByToken(token: string): Promise<ApiTokenModel | null> {
        return await this.findOne({ token })
    }

    
    async findByUnrevokedToken(token: string): Promise<ApiTokenModel | null> {
        return await this.findOne({ token, revokedAt: null })
    }
}