import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import { IPackageJsonService } from '@src/core/interfaces/IPackageJsonService';
import PackageJsonService from '@src/core/services/PackageJsonService';
import defaultCredentials from '../utils/defaultCredentials';

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
        await this.updateEnv(dbType, ref);
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
    async updateEnv(dbType: string, ref: ISetupCommand)
    {
        ref.env.copyFileFromEnvExample();

        let env: Record<string,string> = { DATABASE_DEFAULT_DRIVER: dbType }

        if(dbType === 'mongodb') {
            env = {
                ...env,
                DATABASE_DEFAULT_URI: defaultCredentials.extractDefaultMongoDBCredentials() ?? ''
            }
        }

        await ref.env.updateValues(env);
    }
}

export default SetupDatabaseAction