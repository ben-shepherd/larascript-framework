
import fs from "fs";
import path from "path";
import { IPackageJson, IPackageJsonService } from "../interfaces/IPackageJsonService";

export default class PackageJsonService implements IPackageJsonService {
    packageJsonPath = path.resolve('@src/../', 'package.json')

    /**
     * Get package json
     * @returns 
     */
    getJson = async (): Promise<IPackageJson> => {
        return JSON.parse(await this.readFileContents())  as IPackageJson
    }

    /**
     * Write file contents
     * @param contents 
     * @param filePath 
     * @returns 
     */
    writeFileContents = (contents: string, filePath: string = this.packageJsonPath): Promise<void> => {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, contents, 'utf8', (err) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        })
    }

    /**
     * Read file contents
     * @param filePath 
     * @returns 
     */
    public readFileContents = (filePath: string= this.packageJsonPath): Promise<string> => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }

}