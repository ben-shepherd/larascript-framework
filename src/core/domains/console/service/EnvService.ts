import replaceEnvValue from "@src/core/util/replaceEnvValue";
import fs from "fs";
import path from "path";
import { IEnvService } from "../interfaces/IEnvService";

type UpdateProps = Record<string, string>;

export default class EnvService implements IEnvService {
    envPath = path.resolve('@src/../', '.env')

    envExamplePath = path.resolve('@src/../', '.env.example')

    /**
     * Update values in the .env file
     * 
     * @param secret 
     * @returns 
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
     * 
     * @param filePath 
     * @param props 
     * @returns 
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
     * Read file contents
     * @param filePath 
     * @returns 
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
     * Copy .env.example to .env
     */
    public copyFileFromEnvExample = (from = this.envExamplePath, to = this.envPath) => {
        if (!fs.existsSync(to)) {
            fs.copyFileSync(from, to)   
        }
    }
}