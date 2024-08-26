import { IPackageJsonService } from '@src/core/interfaces/IPackageJsonService';
import PackageJsonService from '@src/core/services/PackageJsonService';
import QuestionDTO from '../DTOs/QuestionDTO';
import { IAction } from '../interfaces/IAction';
import { ISetupCommand } from '../interfaces/ISetupCommand';

class SetupDatabaseAction implements IAction
{
    packageJson: IPackageJsonService;

    constructor() 
    {
        this.packageJson = new PackageJsonService();
    }

    /**
     * Handle the action 
     * - Updates the package.json up script
     * - Updates the .env DATABASE_DRIVER
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any>
    {
        const dbType = question.getAnswer() as string;

        ref.writeLine('Updating package.json');
        await this.updatePackageJsonUpScript(dbType);

        ref.writeLine('Updating .env');
        await this.updateEnvDatabaseDriver(dbType, ref);
    }

    /**
     * Update the package.json up script
     * @param dbType 
     */
    async updatePackageJsonUpScript(dbType: string)
    {
        const packageJson = await this.packageJson.getJson();

        packageJson.scripts.up = `docker-compose -f docker-compose.base.yml -f docker-compose.${dbType}.yml up -d`;

        this.packageJson.writeFileContents(JSON.stringify(packageJson, null, 2));
    }

    /**
     * Update the .env
     * @param dbType 
     * @param ref 
     */
    async updateEnvDatabaseDriver(dbType: string, ref: ISetupCommand)
    {
        ref.env.copyFileFromEnvExample();
        await ref.env.updateValues({ DATABASE_DRIVER: dbType });
    }
}

export default SetupDatabaseAction