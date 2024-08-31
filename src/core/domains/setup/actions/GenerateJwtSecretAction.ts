import { IAction } from "@src/core/domains/setup/interfaces/IAction";
import { ISetupCommand } from "@src/core/domains/setup/interfaces/ISetupCommand";
import QuestionDTO from "../DTOs/QuestionDTO";

class GenerateJwtSecretAction implements IAction
{
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any>
    {
        const answerIsYes = question.getAnswer() === 'y' || question.getAnswer() === 'yes';

        if(!answerIsYes) {
            return;
        }

        const secret = require('crypto').randomBytes(64).toString('hex');

        await ref.env.updateValues({ JWT_SECRET: secret });

        ref.writeLine('Successfully generated jwt secret!');
    }
}

export default GenerateJwtSecretAction