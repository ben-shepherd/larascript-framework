import User, { IUserData } from '@src/app/models/auth/User';
import Factory from '@src/core/base/Factory';

/**
 * Factory for creating User models.
 *
 * @class UserFactory
 * @extends {Factory<User, IUserData>}
 */
export default class UserFactory extends Factory<User, IUserData> {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
        super(User)
    }
    
}
