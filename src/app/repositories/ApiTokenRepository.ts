import BaseApiTokenRepository from "../../core/domains/auth/repository/BaseApiTokenRepository";
import { ApiTokenData } from "../interfaces/ApiTokenData";
import ApiToken from "../models/ApiToken";

export default class ApiTokenRepository extends BaseApiTokenRepository<ApiToken, ApiTokenData> {

    constructor() {
        super(ApiToken);
    }
}