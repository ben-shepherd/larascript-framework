import SetupCommand from '../commands/SetupCommand';
import { IStatementAction } from "../interfaces/IStatementAction";

class GenerateJwtSecretAction implements IStatementAction
{
    async handle(ref: SetupCommand): Promise<any>
    {
        const secret = require('crypto').randomBytes(64).toString('hex');

        await ref.envService.updateValues({ JWT_SECRET: secret });

        ref.writeLine('Successfully generated jwt secret!');
    }
}

export default GenerateJwtSecretAction