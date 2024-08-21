import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import fs from 'fs';
import path from 'path';
import { targetDirectories, templates } from "@src/core/domains/make/consts/MakeTypes";

export default class MakeFileService {
    /**
     * One of the possible template keys e.g. Repository, Model
     */
    public options!: IMakeOptions;

    constructor(options: IMakeOptions) {
        this.options = options;
    }

    /**
     * Checks if a target already exists
     * @param key Command Type
     * @param name Name of the file
     * @returns 
     */
    existsInTargetDirectory(key: keyof typeof templates, name: string): boolean {
        const filePath = targetDirectories[key]
        const fullPath = this.replaceSrcDir(filePath);
        const futureFileName = this.makeFutureFilename(name);
        const futureFilePath = path.resolve(fullPath, futureFileName)

        return fs.existsSync(futureFilePath)
    }

    /**
     * Get contents
     * @param key Command Type
     * @returns 
     */
    async getTemplateContents(key: keyof typeof templates): Promise<string> {
        const filePath = templates[key]
        const fullPath = this.replaceSrcDir(filePath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`)
        }

        return fs.readFileSync(fullPath, 'utf8')
    }

    /**
     * Get the target dir full path
     * @param key Command Type
     * @param name Name of the file
     * @returns 
     */
    public getTargetDirFullPath = (key: typeof targetDirectories[string], name: string): string => {
        const futureFileName = this.makeFutureFilename(name);
        const targetDir = targetDirectories[key]
        const targetDirFullPath = path.resolve(this.replaceSrcDir(targetDir), futureFileName)

        return targetDirFullPath;
    }

    /**
     * Write contents
     * @param key Command Type
     * @param name Name of the file
     * @param contents 
     */
    async writeContent(key: keyof typeof targetDirectories, name: string, contents: string): Promise<void> {
        const targetDirFullPath = this.getTargetDirFullPath(key, name);

        // Ensure the parent folder exists
        const targetDir = path.dirname(targetDirFullPath);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

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

        if(this.options.startWithLowercase) {
            name = name.charAt(0).toLowerCase() + name.slice(1);
        }

        return `${name}${ext}`;
    }

}