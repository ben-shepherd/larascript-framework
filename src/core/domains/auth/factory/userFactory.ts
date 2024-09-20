import User from '@src/app/models/auth/User';
import Factory from '@src/core/base/Factory';
import { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';

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
