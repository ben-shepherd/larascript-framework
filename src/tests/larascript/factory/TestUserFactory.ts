import Factory from '@src/core/base/Factory';
import { IModel, IModelAttributes, ModelConstructor } from '@src/core/domains/models/interfaces/IModel';
import TestUser from '@src/tests/larascript/models/models/TestUser';

/**
 * Factory for creating User models.
 *
 * @class UserFactory
 * @extends {Factory<TestUser, IUserData>}
 */
export default class TestUserFactory extends Factory<TestUser> {

    protected model: ModelConstructor<IModel<IModelAttributes>> = TestUser;
    
}
