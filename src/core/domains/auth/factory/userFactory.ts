import User from '@src/app/models/auth/User';
import Factory from '@src/core/base/Factory';
import { IModel, IModelAttributes, ModelConstructor } from '@src/core/interfaces/IModel';

/**
 * Factory for creating User models.
 *
 * @class UserFactory
 * @extends {Factory<User, IUserData>}
 */
export default class UserFactory extends Factory<User> {

    protected model: ModelConstructor<IModel<IModelAttributes>> = User;
    
}
