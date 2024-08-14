import fs from 'fs';
import SetupCommand from '../commands/SetupCommand';
import { IStatementAction } from "../interfaces/IStatementAction";

class CopyEnvExampleAction implements IStatementAction
{
    async handle(ref: SetupCommand): Promise<any>
    {
        if(fs.existsSync(ref.envService.envPath)) {
            ref.writeLine('Warning: Skipping copying .env.example to .env because .env already exists');
            return;
        }
        
        ref.envService.copyFileFromEnvExample();

        ref.writeLine('Successfully copied .env.example to .env');
    }
}

export default CopyEnvExampleAction