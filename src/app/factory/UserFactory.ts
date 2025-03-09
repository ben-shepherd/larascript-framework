import User from "@src/app/models/auth/User";
import { GROUPS, ROLES } from "@src/config/acl.config";
import Factory from "@src/core/base/Factory";
import { cryptoService } from "@src/core/domains/crypto/service/CryptoService";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";

class UserFactory extends Factory {

    protected model = User;

    getDefinition(): IModelAttributes | null {
        return {
            email: this.faker.internet.email(),
            hashedPassword: cryptoService().hash(this.faker.internet.password()),
            roles: [ROLES.USER],
            groups: [GROUPS.USER],
            firstName: this.faker.person.firstName(),
            lastName: this.faker.person.lastName(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

}

export default UserFactory;
