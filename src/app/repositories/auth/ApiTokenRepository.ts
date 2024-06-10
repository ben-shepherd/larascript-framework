import { ApiTokenData } from "@src/app/interfaces/ApiTokenData";
import ApiToken from "@src/app/models/auth/ApiToken";
import BaseApiTokenRepository from "@src/core/domains/auth/repository/BaseApiTokenRepository";


export default class ApiTokenRepository extends BaseApiTokenRepository<ApiToken, ApiTokenData> {

    constructor() {
        super(ApiToken);
    }
}