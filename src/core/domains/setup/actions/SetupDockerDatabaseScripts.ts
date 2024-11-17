import DatabaseAdapter from '@src/core/domains/database/services/DatabaseAdapter';
import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import { IPackageJsonService } from '@src/core/interfaces/IPackageJsonService';
import PackageJsonService from '@src/core/services/PackageJsonService';

class SetupDockerDatabaseScripts implements IAction {

    packageJson: IPackageJsonService;

    constructor() {
        this.packageJson = new PackageJsonService();
    }


    /**
     * Handle the action 
     * - Updates the package.json up script
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const dbType = question.getAnswer() as string;

        ref.writeLine('Updating package.json');
        await this.updatePackageJsonUpScript(dbType);
    }

    /**
     * Update the package.json up script
     * @param dbType 
     */
    async updatePackageJsonUpScript(dbType: string) {
        const packageJson = await this.packageJson.getJson();
        let dockerComposeNames: string[] = [];

        if(dbType === 'all') {
            dockerComposeNames = ['network', ...this.getComposerShortFileNames()];
        }
        else {
            dockerComposeNames = ['network', dbType];
        }

        const dbUp = this.buildDockerComposeString(dockerComposeNames, 'up --build -d');
        const dbDown = this.buildDockerComposeString(dockerComposeNames, 'down');

        packageJson.scripts['db:up'] = dbUp;
        packageJson.scripts['db:down'] = dbDown;

        await this.packageJson.writeFileContents(JSON.stringify(packageJson, null, 2));
    }


    /**
     * 
     * @param dockerComposeNames Example: ['network', 'mongodb', 'postgres']
     * @param dockerParameters Example: up --build -d
     * @returns 
     */
    private buildDockerComposeString(dockerComposeNames: string[], dockerParameters: string) {

        const baseCommand = 'cd ./docker && docker-compose {dockerComposeNames} {dockerParameters}'
        let composeScriptsStr = '';

        dockerComposeNames.forEach((type: string) => {
            composeScriptsStr += `-f docker-compose.${type}.yml `;
        })

        return baseCommand.replace('{dockerComposeNames}', composeScriptsStr).replace('{dockerParameters}', dockerParameters)
    }

    /**
     * Retrieves an array of short composer file names (e.g., ['mongodb', 'postgres'])
     * @returns {string[]}
     */
    private getComposerShortFileNames(): string[] {
        return DatabaseAdapter.getComposerShortFileNames();
    }

}

export default SetupDockerDatabaseScripts