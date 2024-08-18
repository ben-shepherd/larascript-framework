import User from '@src/app/models/auth/User';
import Factory from '@src/core/base/Factory';
import { IUserData } from '../interfaces/IUserModel';

export default class UserFactory extends Factory<User, IUserData> {
   constructor() {
      super(User)
   }
}