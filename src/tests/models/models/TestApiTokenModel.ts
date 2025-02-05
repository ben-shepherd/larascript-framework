import ApiToken, { ApiTokenAttributes } from '@src/core/domains/auth/models/ApiToken';
import TestUser from '@src/tests/models/models/TestUser';

class TestApiTokenModel extends ApiToken {

    table: string = 'api_tokens';

    constructor(data: ApiTokenAttributes | null = null) {
        super(data);
        this.setUserModelCtor(TestUser)
    }

}

export default TestApiTokenModel
