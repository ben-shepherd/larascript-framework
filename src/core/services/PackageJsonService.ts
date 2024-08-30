
import { IPackageJson, IPackageJsonService } from "@src/core/interfaces/IPackageJsonService";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from 'util';

const execPromise = util.promisify(exec);

export default class PackageJsonService implements IPackageJsonService {

    packageJsonPath = path.resolve('@src/../', 'package.json')

    async installPackage(name: string) {
        const cmd = `yarn add ${name}`
        console.log('Running command: ', cmd)
        await execPromise(cmd);
    }

    async uninstallPackage(name: string) {
        const packageJson = await this.getJson()
        const containsPackage = Object.keys(packageJson.dependencies).includes(name)
        
        if(!containsPackage) {
            return;
        }

        const cmd = `yarn remove ${name}`
        console.log('Running command: ', cmd)
        await execPromise(cmd);
    }

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
    readFileContents = (filePath: string= this.packageJsonPath): Promise<string> => {
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