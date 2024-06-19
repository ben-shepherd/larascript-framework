import User, { UserData } from '@src/app/models/auth/User';
import Factory from '@src/core/base/Factory';

export default class UserFactory extends Factory<User, UserData> {
   constructor() {
      super(User)
   }
}