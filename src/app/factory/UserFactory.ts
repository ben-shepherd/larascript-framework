import { GROUPS, ROLES } from "@src/config/acl";
import Factory from "@src/core/base/Factory";
import hashPassword from "@src/core/domains/auth/utils/hashPassword";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import User from "@src/app/models/auth/User";

class UserFactory extends Factory {

    protected model = User;

    getDefinition(): IModelAttributes | null {
        return {
            email: this.faker.internet.email(),
            hashedPassword: hashPassword(this.faker.internet.password()),
            roles: [ROLES.USER],
            groups: [GROUPS.User],
            firstName: this.faker.person.firstName(),
            lastName: this.faker.person.lastName(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

}

export default UserFactory;
