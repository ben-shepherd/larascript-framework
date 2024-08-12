import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import fs from "fs";
import path from "path";

export default class GenerateJwtSecret extends BaseCommand {

    signature: string = 'app:generate-jwt-secret';

    envPath = path.resolve('@src/../', '.env')

    envExamplePath = path.resolve('@src/../', '.env.example')

    execute = async () => {
        try {
            // Generate a secret
            const secret = require('crypto').randomBytes(64).toString('hex');

            // Create or update the env file
            this.updateEnvFile(secret);
            this.createEnvFile(secret);
        }
        catch (err) {
            console.error(err)
        }
    }

    /**
     * @param secret 
     * @returns 
     */
    createEnvFile = async (secret: string) => {

        // Check if .env file exists
        if (fs.existsSync(this.envPath)) {
            return;
        }

        // Read the file
        let contents = await this.readFileContents(this.envExamplePath)

        // Add secret to contents
        contents = this.addSecretToString(contents, secret)

        // Write the file
        fs.writeFileSync(this.envPath, contents)
    }

    /**
     * @param secret 
     * @returns 
     */
    updateEnvFile = async (secret: string) => {

        // Check if the file exists
        if (!fs.existsSync(this.envPath)) {
            return;
        }

        // Read the file
        let contents = await this.readFileContents(this.envPath)

        // Add secret to contents
        contents = this.addSecretToString(contents, secret)

        // Write the file
        fs.writeFileSync(this.envPath, contents)
    }

    /**
     * Read file contents
     * @param filePath 
     * @returns 
     */
    readFileContents = (filePath): Promise<string> => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    /**
     * Updates JWT_SECRET property in a string
     * @param content 
     * @param secret 
     * @returns 
     */
    addSecretToString = (content: string, secret: string): string => {
        const pattern = /(JWT_SECRET=.*)/g;
        const regex = content.match(pattern)

        if(regex?.[0]) {
            content = content.replace(regex[0], `JWT_SECRET=${secret}`)
        }
        
        return content
    }
}