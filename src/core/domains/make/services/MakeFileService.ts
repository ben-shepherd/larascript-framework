import { targetDirectories, templates } from "@src/core/domains/make/consts/MakeTypes";
import { IMakeFileArguments } from "@src/core/domains/make/interfaces/IMakeFileArguments";
import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import fs from 'fs';
import path from 'path';


export default class MakeFileService {
    
    public options!: IMakeOptions;
    protected arguments!: IMakeFileArguments;


    constructor(options: IMakeOptions, makeFileArguments: IMakeFileArguments) {
        this.options = options
        this.arguments = makeFileArguments
    }

    /**
     * Checks if a target already exists
     * @param name Name of the file
     */
    existsInTargetDirectory(): boolean {
        const filePath = targetDirectories[this.options.makeType]
        const fullPath = this.replaceSrcDir(filePath);
        const futureFileName = this.makeFutureFilename();
        const futureFilePath = path.resolve(fullPath, futureFileName)

        return fs.existsSync(futureFilePath)
    }

    /**
     * Get contents
     */
    async getTemplateContents(): Promise<string> {
        const filePath = templates[this.options.makeType]
        const fullPath = this.replaceSrcDir(filePath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`)
        }

        return fs.readFileSync(fullPath, 'utf8')
    }

    /**
     * Get the target dir full path
     * @param name Name of the file
     * @returns 
     */
    public getTargetDirFullPath = (): string => {
        const futureFileName = this.makeFutureFilename();
        const targetDir = targetDirectories[this.options.makeType]
        const targetDirFullPath = path.resolve(this.replaceSrcDir(targetDir), futureFileName)

        return targetDirFullPath;
    }

    /**
     * Write contents
     * @param contents 
     */
    async writeContent(contents: string): Promise<void> {
        const targetDirFullPath = this.getTargetDirFullPath();

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
    makeFutureFilename(ext: string = '.ts'): string {
        return `${this.arguments.name}${ext}`;
    }

}