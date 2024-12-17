import ApiToken from '@src/app/models/auth/ApiToken';
import { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel';
import TestUser from '@src/tests/models/models/TestUser';

class TestApiTokenModel extends ApiToken {

    table: string = 'api_tokens';


    constructor(data: IApiTokenData | null = null) {
        super(data);
        this.setUserModelCtor(TestUser)
    }

}

export default TestApiTokenModel
