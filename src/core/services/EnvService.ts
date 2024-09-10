import { IEnvService } from "@src/core/interfaces/IEnvService";
import replaceEnvValue from "@src/core/util/replaceEnvValue";
import fs from "fs";
import path from "path";

type UpdateProps = Record<string, string>;

/**
 * Environment variables service
 */
export default class EnvService implements IEnvService {

    /**
     * Path to the .env file
     */
    public envPath = path.resolve('@src/../', '.env');

    /**
     * Path to the .env.example file
     */
    public envExamplePath = path.resolve('@src/../', '.env.example');

    /**
     * Updates values in the .env file
     * @param props - key-value pairs to update
     * @param filePath - path to the file to update (defaults to envPath)
     */
    public updateValues = async (props: UpdateProps, filePath = this.envPath) => {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return;
        }

        // Fetch and update the file
        const contents = await this.fetchAndUpdateContent(filePath, props)

        // Write the file
        fs.writeFileSync(filePath, contents)
    }

    /**
     * Fetches and updates the contents of the file
     * @param filePath - path to the file to fetch and update
     * @param props - key-value pairs to update
     * @returns the updated contents of the file
     */
    public fetchAndUpdateContent = async (filePath: string, props: UpdateProps): Promise<string> => {
        let contents: string = '';

        contents = await this.readFileContents(filePath)

        // Replace properties
        for (const [key, value] of Object.entries(props)) {
            contents = replaceEnvValue(key, value, contents)
        }

        return contents
    }

    /**
     * Reads the contents of the file
     * @param filePath - path to the file to read
     * @returns the contents of the file
     */
    public readFileContents = (filePath): Promise<string> => {
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
     * Copies the .env.example file to the .env file if it doesn't exist
     * @param from - path to the file to copy from (defaults to envExamplePath)
     * @param to - path to the file to copy to (defaults to envPath)
     */
    public copyFileFromEnvExample = (from = this.envExamplePath, to = this.envPath) => {
        if (!fs.existsSync(to)) {
            fs.copyFileSync(from, to)   
        }
    }

}