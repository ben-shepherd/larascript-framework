import BaseApiTokenModel from '../../core/domains/auth/models/BaseApiTokenModel';
import { BaseApiTokenData } from '../../core/domains/auth/types/types.t';

export default class ApiToken extends BaseApiTokenModel {

    constructor(data: BaseApiTokenData | null = null) {
        super(data);
    }
}