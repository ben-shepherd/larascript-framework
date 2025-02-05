import { ApiTokenAttributes } from '@src/core/domains/auth-legacy/interfaces/IApitokenModel';
import ApiToken from '@src/core/domains/auth/models/ApiToken';
import TestUser from '@src/tests/models/models/TestUser';

class TestApiTokenModel extends ApiToken {

    table: string = 'api_tokens';


    constructor(data: ApiTokenAttributes | null = null) {
        super(data);
        this.setUserModelCtor(TestUser)
    }

}

export default TestApiTokenModel
