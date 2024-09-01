import checksumFile from '@src/core/util/checksum';
import fs from 'fs';
import path from 'path';
import { IMigration } from '@src/core/domains/migrations/interfaces/IMigration';

class MigrationFileService
{
    appMigrationsDir = path.resolve('@src/../src', 'app/migrations');

    /**
     * Get the checksum of the specified file
     * @param fileName 
     * @returns 
     */
    checksum = async (fileName: string): Promise<string> => {
        if(!fileName.endsWith('.ts')) {
            fileName = `${fileName}.ts`;
        }
        
        return await checksumFile(path.resolve('@src/../src/app/migrations', fileName));
    }

    /**
     * Get an instance of the class that implements IMigration from the specified file name
     * @param fileName 
     * @returns 
     */
    getImportMigrationClass = async (fileName: string): Promise<IMigration> => {
        if(!fileName.endsWith('.ts')) {
            fileName = `${fileName}.ts`;
        }

        const absolutePath = path.resolve(this.appMigrationsDir, fileName);

        if(!fs.existsSync(absolutePath)) {
            throw new Error(`File ${absolutePath} does not exist`);
        }

        const importedModule = await import(absolutePath);

        if(importedModule.default) {
            return new importedModule.default() as IMigration;
        }

        const exportedClass = Object.values(importedModule).find(
            (value): value is new () => IMigration => {
                return typeof value === 'function';
            } 
        );

        if(!exportedClass) {
            throw new Error(`File ${absolutePath} does not export expected class which implements IMigration`);
        }

        return new exportedClass();
    }

    /**
     * Get all migration file names from oldest to newest
     * @returns 
     */
    getMigrationFileNames(): string[]
    {
        const files = fs.readdirSync(this.appMigrationsDir)
            // Remove the .ts extension
            .map((file) => file.replace('.ts', ''))

        return files;
    }

    /**
     * Create a date filename
     * @param name 
     * @returns 
     */
    createDateFilename(name: string) 
    {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month}-${day}-${name}.ts`;
    }

    /**
     * Parse the date from the file name
     * Expected format: YYYY-MM-DD
     * @param fileName 
     * @returns 
     */
    parseDate(fileName: string): Date | null
    {
        const pattern = /^(\d{4})-(\d{2})-(\d{2})/;
        const match = pattern.exec(fileName);

        if(!match) {
            return null;
        }

        const [, year, month, day] = match;

        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 1, 1, 1)
    }
}

export default MigrationFileService