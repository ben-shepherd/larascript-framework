import ApiTokenFactory from '@src/core/domains/auth-legacy/factory/apiTokenFactory';
import { IModel, IModelAttributes, ModelConstructor } from '@src/core/interfaces/IModel';

import TestApiTokenModel from '../models/models/TestApiTokenModel';

/**
 * Factory for creating ApiToken models.
 */
class TestApiTokenFactory extends ApiTokenFactory {

    protected model: ModelConstructor<IModel<IModelAttributes>> = TestApiTokenModel;

}



export default TestApiTokenFactory
