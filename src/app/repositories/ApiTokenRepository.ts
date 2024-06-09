import BaseApiTokenModel from "../../core/domains/Auth/models/BaseApiTokenModel";
import BaseApiTokenRepository from "../../core/domains/Auth/repository/BaseApiTokenRepository";
import { BaseApiTokenData } from "../../core/domains/Auth/types/types.t";

export default class ApiTokenRepository extends BaseApiTokenRepository<BaseApiTokenModel, BaseApiTokenData> {

    constructor() {
        super(BaseApiTokenModel);
    }
}