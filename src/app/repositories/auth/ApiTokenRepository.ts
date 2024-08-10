import ApiToken from "@src/app/models/auth/ApiToken";
import BaseApiTokenRepository from "@src/core/domains/Auth/repository/BaseApiTokenRepository";


export default class ApiTokenRepository extends BaseApiTokenRepository<ApiToken> 
{
    constructor() {
        super('apiTokens', ApiToken)
    }
}