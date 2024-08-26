import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IConsoleInputService } from '@src/core/domains/console/interfaces/IConsoleInputService';
import ConsoleInputService from '@src/core/domains/console/service/ConsoleInputService';
import QuestionDTO from '@src/core/domains/setup/DTOs/QuestionDTO';
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';
import buildQuestionDTOs from '@src/core/domains/setup/utils/buildQuestionDTOs';
import { IEnvService } from '@src/core/interfaces/IEnvService';
import EnvService from "@src/core/services/EnvService";
import readline from 'node:readline';

class AppSetupCommand extends BaseCommand implements ISetupCommand
{
    public signature = 'app:setup';
    public description = 'Setup the application';
    rl: readline.Interface;
    env: IEnvService;
    input: IConsoleInputService;

    constructor() {
        super();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.env = new EnvService();
        this.input = new ConsoleInputService(this.rl);
    }

    /**
     * Writes a line to the console
     * @param text 
     */
    writeLine = (text: string = '') => {
        this.input.writeLine(text);
    }

    /**
     * Executes the command
     */
    public execute = async () =>
    {
        const questionsAll = buildQuestionDTOs();

        this.writeLine('--- Larascript Setup ---');
        this.writeLine();
        this.writeLine('Setup Preview:');

        for (const i in questionsAll) {
            const question = questionsAll[i];
            this.writeLine(`- ${question.getPreviewText()}`);
        }

        this.writeLine();
        await this.input.waitForEnter('When ready, press Enter to continue');

        for (const i in questionsAll) {
            const question = questionsAll[i];
        
            this.input.clearScreen()
            
            await this.processQuestionDTO(question)
        }

        this.rl.close();

        if(!this.keepProcessAlive) {
            process.nextTick(() => process.exit(0));   
        }
    }

    /**
     * Processes questions, statements and actions
     * 
     * @param question 
     */
    processQuestionDTO = async (question: QuestionDTO) => {
        await this.processStatement(question);
        await this.processQuestion(question);
        await this.processAction(question);
    }

    /**
     * Writes a statement to the console
     * 
     * @param question 
     * @returns 
     */
    processStatement = async (question: QuestionDTO) => {
        if (!question.statement) {
            return;
        }

        this.writeLine(question.getText());
        this.writeLine();
        await this.input.waitForEnter();
    }

    /**
     * Asks a question to the user
     * 
     * @param question 
     * @returns 
     */
    processQuestion = async (question: QuestionDTO) => {
        if (question.statement) {
            return;
        }

        this.writeLine(question.getText());

        if (question.defaultValue) {
            this.writeLine(`Default: ${question.defaultValue}`);
        }

        question.answer = await this.input.askQuestion('');

        if (question.acceptedAnswers && !question.acceptedAnswers.includes(question.answer)) {
            this.writeLine(`Unexpected answer. Please try again.`);
            await this.input.waitForEnter();
            return await this.processQuestion(question);
        }

        let value: string = this.input.normalizeAnswer(question.answer, question.defaultValue);

        await this.env.updateValues({ [question.id]: value });
    }
    
    /**
     * Runs the action
     * 
     * @param question 
     * @returns 
     */
    processAction = async (question: QuestionDTO) => {
        if (!question.actionCtor) {
            return;
        }

        const action = new question.actionCtor();
        await action.handle(this, question);
    }
}

export default AppSetupCommand