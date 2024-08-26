import readline from 'node:readline';
import BaseCommand from "../../console/base/BaseCommand";
import { IConsoleInputService } from '../../console/interfaces/IConsoleInputService';
import { IEnvService } from '../../console/interfaces/IEnvService';
import ConsoleInputService from '../../console/service/ConsoleInputService';
import EnvService from "../../console/service/EnvService";
import QuestionDTO from '../DTOs/QuestionDTO';
import { ISetupCommand } from '../interfaces/ISetupCommand';
import buildQuestionDTOs from '../utils/buildQuestionDTOs';

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

    public execute = async () =>
    {
        const questionsAll = buildQuestionDTOs();

        this.writeLine('--- App Setup ---');
        this.writeLine();

        this.writeLine('Preview of the questions:');
        for (const i in questionsAll) {
            const question = questionsAll[i];
            this.writeLine(`- ${question.getText()}`);
        }

        this.writeLine();
        await this.input.waitForEnter('When ready, press Enter to continue');

        for (const i in questionsAll) {
            const question = questionsAll[i];
        
            this.input.clearScreen()
            
            await this.processAnswer(
                await this.promptUserForAnswer(question)
            )
        }

        this.rl.close();

        if(!this.keepProcessAlive) {
            process.nextTick(() => process.exit(0));   
        }
    }

    /**
     * Prompts the user for an answer
     * 
     * @param question 
     * @returns 
     */
    promptUserForAnswer = async (question: QuestionDTO): Promise<QuestionDTO> => {
        if (question.statement) {
            this.writeLine(question.getText());
            this.writeLine();
            await this.input.waitForEnter();
            return question;
        }

        this.writeLine(question.getText());

        if (question.defaultValue) {
            this.writeLine(`Default: ${question.defaultValue}`);
        }

        question.answer = await this.input.askQuestion('');
        return question
    }

    /**
     * Processes the statement and runs an action
     * Alternatively, Updates the values in the environment
     * 
     * @param question 
     */
    processAnswer = async (question: QuestionDTO) => {
        await this.processStatementAction(question);
        await this.processInput(question);
    }

    /**
     * If the question is a statement, there may be an action that needs to happen before the next question is processed
     * 
     * Example:
     * Press Enter to continue > Generates a JWT Secret
     * @param question 
     * @returns 
     */
    processStatementAction = async (question: QuestionDTO) => {
        if (!question.statement) {
            return;
        }

        if(!question.actionCtor) {
            throw new Error(`Missing actionCtor for statement: ${question.statement}`)
        }

        const action = new question.actionCtor();
        await action.handle(this, question.answer);
        this.writeLine();
    }

    /**
     * Updates the values in the environment
     * 
     * @param question 
     * @returns 
     */
    processInput = async (question: QuestionDTO) => {
        if (question.statement) {
            return;
        }

        let value: string = this.input.normalizeAnswer(question.answer, question.defaultValue);

        await this.env.updateValues({ [question.id]: value });
    }
    
}

export default AppSetupCommand