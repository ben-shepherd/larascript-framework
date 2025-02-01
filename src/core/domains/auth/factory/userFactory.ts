import User from '@src/app/models/auth/User';
import { GROUPS, ROLES } from '@src/config/auth';
import Factory from '@src/core/base/Factory';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import hashPassword from '@src/core/domains/auth/utils/hashPassword';

/**
 * Factory for creating User models.
 *
 * @class UserFactory
 * @extends {Factory<User, IUserData>}
 */
export default class UserFactory extends Factory<User> {

    protected model = User;

    getDefinition(): IUserModel['attributes'] {
        return {
            email: this.faker.internet.email(),
            password: this.faker.internet.password(),
            hashedPassword: hashPassword(this.faker.internet.password()),
            groups: [GROUPS.User],
            roles: [ROLES.USER],

            firstName: this.faker.person.firstName(),
            lastName: this.faker.person.lastName(),
        } as IUserModel['attributes']
    }

}

