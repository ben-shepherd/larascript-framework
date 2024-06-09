import BaseApiTokenModel from '../../core/domains/Auth/models/BaseApiTokenModel';
import { BaseApiTokenData } from '../../core/domains/Auth/types/types.t';

export default class ApiToken extends BaseApiTokenModel {

    constructor(data: BaseApiTokenData | null = null) {
        super(data);
    }
}