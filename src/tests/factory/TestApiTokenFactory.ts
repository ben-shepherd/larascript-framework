import ApiTokenFactory from '@src/core/domains/auth/factory/apiTokenFactory'

import TestApiTokenModel from '../models/models/TestApiTokenModel'

/**
 * Factory for creating ApiToken models.
 */
class TestApiTokenFactory extends ApiTokenFactory {

    constructor() {
        super(TestApiTokenModel)
    }

}


export default TestApiTokenFactory
