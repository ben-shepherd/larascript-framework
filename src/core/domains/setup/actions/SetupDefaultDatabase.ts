import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import defaultCredentials from '@src/core/domains/setup/utils/defaultCredentials';
import InvalidDefaultCredentialsError from '@src/core/domains/setup/exceptions/InvalidDefaultCredentialsError';

class SetupDefaultDatabase implements IAction {

    /**
     * Handle the action 
     * - Updates the .env DATABASE_DRIVER
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const dbType = question.getAnswer() as string;

        if(dbType === 'all') {
            return;
        }

        ref.writeLine('Updating .env');
        await this.updateEnv(dbType, ref);
    }

    /**
     * Update the .env
     * @param dbType 
     * @param ref 
     */
    async updateEnv(dbType: string, ref: ISetupCommand) {
        ref.env.copyFileFromEnvExample();

        const extractors = {
            mongodb: defaultCredentials.extractDefaultMongoDBCredentials,
            postgres: defaultCredentials.extractDefaultPostgresCredentials
        }

        let env: Record<string,string> = { DATABASE_DEFAULT_PROVIDER: dbType }
        let databaseDefaultUri = undefined;

        if(extractors[dbType]) {
            databaseDefaultUri = extractors[dbType]();

            if(!databaseDefaultUri) {
                throw new InvalidDefaultCredentialsError(`The default credentials are invalid or could not be found for provider '${dbType}'`);
            }

            env = {
                ...env,
                DATABASE_DEFAULT_URI: databaseDefaultUri
            }

            await ref.env.updateValues(env);
        }
    }

}

export default SetupDefaultDatabase