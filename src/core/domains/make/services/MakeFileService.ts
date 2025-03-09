import { targetDirectories, templates } from "@src/core/domains/make/consts/MakeTypes";
import { IMakeFileArguments } from "@src/core/domains/make/interfaces/IMakeFileArguments";
import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import fs from 'fs';
import path from 'path';


/**
 * Responsible for creating a new file based on a template
 * 
 * Handles: 
 * - Getting the template contents
 * - Writing the new file
 * - Determining the target dir full path
 * - Replacing the fileName with the new name
 * - Replacing @src with the src/ directory
 * - Creating a future filename
 */
export default class MakeFileService {
    
    public options!: IMakeOptions;

    protected arguments!: IMakeFileArguments;


    /**
     * Constructor
     * @param options Options for the make command
     * @param makeFileArguments Arguments passed to the make command
     */
    constructor(options: IMakeOptions, makeFileArguments: IMakeFileArguments) {
        this.options = options
        this.arguments = makeFileArguments
    }

    /**
     * Checks if a target already exists
     * @param name Name of the file
     * @returns True if the file already exists, false otherwise
     */
    existsInTargetDirectory(): boolean {
        const filePath = targetDirectories[this.options.makeType]
        const fullPath = this.replaceSrcDir(filePath);
        const futureFileName = this.makeFutureFilename();
        const futureFilePath = path.resolve(fullPath, futureFileName)

        return fs.existsSync(futureFilePath)
    }

    /**
     * Get contents of the template
     * @returns Template contents
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
     * @returns Target dir full path
     */
    public getTargetDirFullPath = (): string => {
        const futureFileName = this.makeFutureFilename();
        const targetDir = targetDirectories[this.options.makeType]
        const targetDirFullPath = path.resolve(this.replaceSrcDir(targetDir), futureFileName)

        return targetDirFullPath;
    }

    /**
     * Write contents to the target file
     * @param contents Contents to write
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
     * @returns Updated path
     */
    updateOriginalPathFilename(originalPath: string, fileName: string): string {
    // use negative lookup to determine the last string after the last '/'
        return originalPath.replace(/\/(?!.*\/)(.+)$/, `/${fileName}.ts`)
    }

    /**
     * Replaces @src with the src/ directory
     * @param targetDir 
     * @returns Updated path
     */
    replaceSrcDir(targetDir: string) {
        if(typeof targetDir !== 'string') {
            throw new Error('Expected targetDir to be a string, received: ' + typeof targetDir)
        }

        return targetDir.replace(/^@src\//, 'src/');
    }


    /**
     * Makes a future filename
     * @param templateName 
     * @param name 
     * @param ext 
     * @returns Future filename
     */
    makeFutureFilename(ext: string = '.ts'): string {

        // Use a custom function if provided
        if(typeof this.options.customFilename === 'function') {
            const fileName = this.options.customFilename(this.arguments.name);
            return fileName.endsWith(ext) ? fileName : `${fileName}${ext}`
        }

        return `${this.arguments.name}${ext}`;
    }

}
