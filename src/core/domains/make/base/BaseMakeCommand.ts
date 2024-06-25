import fs from 'fs';
import path from 'path';
import BaseCommand from "../../console/base/BaseCommand";

export const targetDirectories: Record<string,string> = {
    Repository: '@src/app/repositories',
    Model: '@src/app/models',
    Listener: '@src/app/events/listeners',
    Subscriber: '@src/app/events/subscribers',
    Service: '@src/app/services',
    Singleton: '@src/app/services',
    Command: '@src/app/commands',
    Observer: '@src/app/observers',
} as const;

export const templates: Record<string, string> = {
    Repository: '@src/core/domains/make/templates/Repository.ts.template',
    Model: '@src/core/domains/make/templates/Model.ts.template',
    Listener: '@src/core/domains/make/templates/Listener.ts.template',
    Subscriber: '@src/core/domains/make/templates/Subscriber.ts.template',
    Service: '@src/core/domains/make/templates/Service.ts.template',
    Singleton: '@src/core/domains/make/templates/Singleton.ts.template',
    Command: '@src/core/domains/make/templates/Command.ts.template',
    Observer: '@src/core/domains/make/templates/Observer.ts.template',
} as const;

export default abstract class BaseMakeCommand extends BaseCommand
{
    /**
     * One of the possible template keys e.g. Repository, Model
     */
    public key!: string;

    /**
     * Checks if a target already exists
     * @param key 
     * @param name 
     * @returns 
     */
    existsInTargetDirectory(key: keyof typeof templates, name: string): boolean
    {
        const filePath = targetDirectories[key]
        const fullPath = this.replaceSrcDir(filePath);
        const futureFileName = this.makeFutureFilename(name);
        const futureFilePath = path.resolve(fullPath, futureFileName)

        return fs.existsSync(futureFilePath)
    }

    /**
     * Get contents
     * @param key 
     * @returns 
     */
    async getTemplateContents(key: keyof typeof templates): Promise<string>
    {
        const filePath = templates[key]
        const fullPath = this.replaceSrcDir(filePath);

        if(!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`)
        }

        return fs.readFileSync(fullPath, 'utf8')
    }

    /**
     * Write contents
     * @param key 
     * @param name 
     * @param contents 
     */
    async writeContent(key: keyof typeof targetDirectories, name: string, contents: string): Promise<void>
    {
        const futureFileName = this.makeFutureFilename(name);        
        const targetDir = targetDirectories[key]
        const targetDirFullPath = path.resolve(this.replaceSrcDir(targetDir), futureFileName)

        fs.writeFileSync(targetDirFullPath, contents)
    }

    /**
     * Take the fileName in the path and replace it with the new name
     * @param originalPath 
     * @param fileName 
     * @returns 
     */
    updateOriginalPathFilename(originalPath: string, fileName: string): string {
        // use negative lookup to determine the last string after the last '/'
        return originalPath.replace(/\/(?!.*\/)(.+)$/, `/${fileName}.ts`)
    }

    /**
     * Replaces @src with the src/ directory
     * @param targetDir 
     * @returns 
     */
    replaceSrcDir(targetDir: string) {
        return targetDir.replace(/^@src\//, 'src/');
    }

    /**
     * Make a future filename
     * @param templateName 
     * @param name 
     * @param ext 
     * @returns 
     */
    makeFutureFilename(name: string, ext: string = '.ts'): string {
        return `${name}${ext}`;
    }

}