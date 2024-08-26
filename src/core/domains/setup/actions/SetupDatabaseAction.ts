import { IAction } from '../interfaces/IAction';
import { ISetupCommand } from '../interfaces/ISetupCommand';

class SetupDatabaseAction implements IAction
{
    async handle(ref: ISetupCommand, answer: string): Promise<any>
    {
        console.log('Setting up database...', answer)
    }
}

export default SetupDatabaseAction