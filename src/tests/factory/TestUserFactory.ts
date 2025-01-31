import Factory from '@src/core/base/Factory';
import TestUser from '@src/tests/models/models/TestUser';

/**
 * Factory for creating User models.
 *
 * @class UserFactory
 * @extends {Factory<TestUser, IUserData>}
 */
export default class TestUserFactory extends Factory<TestUser> {

    protected model = TestUser;

}
