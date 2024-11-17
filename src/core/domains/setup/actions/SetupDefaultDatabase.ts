import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import InvalidDefaultCredentialsError from '@src/core/domains/setup/exceptions/InvalidDefaultCredentialsError';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import { App } from '@src/core/services/App';

class SetupDefaultDatabase implements IAction {

    /**
     * Handle the action 
     * - Updates the .env DATABASE_DRIVER
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const adapterName = question.getAnswer() as string;

        if(adapterName === 'all') {
            return;
        }

        ref.writeLine('Updating .env');
        await this.updateEnv(adapterName, ref);
    }

    /**
     * Update the .env
     * @param adapterName 
     * @param ref 
     */
    async updateEnv(adapterName: string, ref: ISetupCommand) {
        ref.env.copyFileFromEnvExample();

        const credentials = App.container('db').getDefaultCredentials(adapterName);

        if(!credentials) {
            throw new InvalidDefaultCredentialsError(`The default credentials are invalid or could not be found for adapter '${adapterName}'`);
        }

        const env: Record<string,string> = { 
            DATABASE_DEFAULT_CONNECTION: adapterName,
            DATABASE_DEFAULT_PROVIDER: adapterName,
            DATABASE_DEFAULT_URI: credentials,
        }

        await ref.env.updateValues(env);
    }

}

export default SetupDefaultDatabase