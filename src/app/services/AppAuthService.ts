import BaseAuthService from "../../core/domains/auth/services/BaseAuthService";
import { IAuthConfig } from "../../core/interfaces/IAuthConfig";
import ApiToken from "../models/auth/ApiToken";

export class AppAuthService extends BaseAuthService<ApiToken> {

    constructor(config: IAuthConfig) {
        super(config)
    }
}