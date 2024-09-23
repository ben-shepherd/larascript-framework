import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IEnvService } from "@src/core/interfaces/IEnvService";
import EnvService from "@src/core/services/EnvService";

class GenerateJwtSecret extends BaseCommand {

    signature = 'auth:generate-jwt-secret';

    private envService: IEnvService = new EnvService();

    async execute() {

        this.input.writeLine('--- Generate JWT Secret ---');
        const answer = await this.input.askQuestion('Re-generate JWT Secret? This will update your .env file. (y/n)')
        

        if (answer !== 'y') {
            return;
        }

        const secret = require('crypto').randomBytes(64).toString('hex');

        await this.envService.updateValues({ JWT_SECRET: secret });

        this.input.writeLine('Successfully generated jwt secret!');
    }

}

export default GenerateJwtSecret