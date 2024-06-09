import BaseApiTokenRepository from "../../core/domains/auth/repository/BaseApiTokenRepository";
import { BaseApiTokenData } from "../../core/domains/auth/types/types.t";
import ApiToken from "../models/ApiToken";

export default class ApiTokenRepository extends BaseApiTokenRepository<ApiToken, BaseApiTokenData> {

    constructor() {
        super(ApiToken);
    }
}