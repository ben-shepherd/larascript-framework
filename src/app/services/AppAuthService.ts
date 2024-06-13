import BaseAuthService from "@src/core/domains/auth/services/BaseAuthService";
import { IAuthConfig } from "@src/core/interfaces/IAuthConfig";
import ApiToken from "../models/auth/ApiToken";

export class AppAuthService extends BaseAuthService<ApiToken> {

    constructor(config: IAuthConfig) {
        super(config)
    }
}