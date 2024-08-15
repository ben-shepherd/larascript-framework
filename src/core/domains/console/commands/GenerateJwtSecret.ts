import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import EnvService from "../service/EnvService";

export default class GenerateJwtSecret extends BaseCommand {

    signature: string = 'app:generate-jwt-secret';

    execute = async () => {
        try {
            const envService = new EnvService();

            // Generate a secret
            const secret = require('crypto').randomBytes(64).toString('hex');

            // Copy over env file from example
            envService.copyFileFromEnvExample();

            // Update the secret
            await envService.updateValues({ JWT_SECRET: secret });
        }
        catch (err) {
            console.error(err)
        }
    }
}