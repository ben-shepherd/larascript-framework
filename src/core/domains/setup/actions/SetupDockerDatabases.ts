import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import { IPackageJsonService } from '@src/core/interfaces/IPackageJsonService';
import PackageJsonService from '@src/core/services/PackageJsonService';
import DatabaseConfig from '../../database/config/DatabaseConfig';

class SetupDockerDatabases implements IAction
{
    packageJson: IPackageJsonService;

    constructor() 
    {
        this.packageJson = new PackageJsonService();
    }

    /**
     * Handle the action 
     * - Updates the package.json up script
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any>
    {
        const dbType = question.getAnswer() as string;

        ref.writeLine('Updating package.json');
        await this.updatePackageJsonUpScript(dbType);
    }

    /**
     * Update the package.json up script
     * @param dbType 
     */
    async updatePackageJsonUpScript(dbType: string)
    {
        const packageJson = await this.packageJson.getJson();
        let composeScriptsToInclude = '';

        const appendDbType = (db: string) => `-f docker-compose.${db}.yml `;

        if(dbType === 'all') {
            Object.keys(DatabaseConfig.drivers).forEach((type) => {
                composeScriptsToInclude += appendDbType(type);
            })
        }
        else {
            composeScriptsToInclude = appendDbType(dbType);
        }

        packageJson.scripts.up = `docker-compose -f docker-compose.base.yml ${composeScriptsToInclude} up -d`;
        packageJson.scripts.down = `docker-compose -f docker-compose.base.yml ${composeScriptsToInclude} down`;

        await this.packageJson.writeFileContents(JSON.stringify(packageJson, null, 2));
    }

}

export default SetupDockerDatabases