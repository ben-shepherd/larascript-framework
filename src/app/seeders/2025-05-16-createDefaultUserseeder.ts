import { faker } from "@faker-js/faker";
import User from "@src/app/models/auth/User";
import { GROUPS, ROLES } from "@src/config/acl.config";
import { cryptoService } from "@src/core/domains/crypto/service/CryptoService";
import BaseSeeder from "@src/core/domains/migrations/base/BaseSeeder";

export class CreateDefaultUserSeeder extends BaseSeeder {

    async up(): Promise < void> {

        // Change the example to suit your needs
        await User.query().insert([
            {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                hashedPassword: cryptoService().hash('superSecret!123'),
                groups: [GROUPS.USER],
                roles: [ROLES.USER],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

    }

}

export default CreateDefaultUserSeeder