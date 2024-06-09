import BaseAuthService from "../../core/domains/auth/services/BaseAuthService";
import { IAuthConfig } from "../../core/interfaces/IAuthConfig";
import ApiToken from "../models/ApiToken";
import User from "../models/User";

export class AppAuthService extends BaseAuthService<User, ApiToken> {

    constructor(config: IAuthConfig) {
        super(config)
    }
}