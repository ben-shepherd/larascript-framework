import { IAction } from '@src/core/domains/setup/interfaces/IAction';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import QuestionDTO from '../DTOs/QuestionDTO';

class EnableExpress implements IAction
{
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any>
    {
        const answerIsEnabled = question.getAnswer() === 'y' || question.getAnswer() === 'yes';

        ref.env.updateValues({ EXPRESS_ENABLED: answerIsEnabled ? 'true' : 'false' });
    }
}

export default EnableExpress