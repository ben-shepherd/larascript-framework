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
    questions!: QuestionDTO[];

    constructor() {
        super();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.env = new EnvService();
        this.input = new ConsoleInputService(this.rl);
        this.questions = buildQuestionDTOs();
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
        let count = 1;

        this.input.clearScreen();
        this.writeLine('--- Larascript Setup ---');
        this.writeLine();
        this.writeLine('Setup Preview:');

        this.questions.forEach(question => {
            this.writeLine(`- ${question.getPreviewText()}`);
        })

        this.writeLine();
        await this.input.waitForEnter('When ready, press Enter to continue');
        
        for(const i in this.questions) {
            const question = this.questions[i];
            
            this.input.clearScreen()
            
            await this.processQuestionDTO(count, question)

            count++;
            this.questions[parseInt(i)] = question
        }
 
        this.input.clearScreen();

        this.writeLine('--- Setup Complete ---');
        this.writeLine('Happy coding!');
        this.writeLine('');

        this.rl.close();

        if(!this.keepProcessAlive) {
            process.nextTick(() => process.exit(0));   
        }
    }

    /**
     * Determines if a question should be processed
     * @param question 
     * @param previousQuestion 
     * @returns 
     */
    questionIsApplicable = (question: QuestionDTO): boolean => {

        if(!question.applicableOnly) {
            return true;
        }
        
        const ifId = question.applicableOnly.ifId;
        const ifIdQuestion = this.questions.find(q => q.id === ifId) as QuestionDTO;
        const matchesAnswer = question.applicableOnly.answerIncludes.includes(ifIdQuestion.getAnswer() as string)

        if(!matchesAnswer) {
            return false;
        }

        return true;
    }

    /**
     * Processes questions, statements and actions
     * 
     * @param question 
     */
    processQuestionDTO = async (count: number, question: QuestionDTO) => {

        if(!this.questionIsApplicable(question)) {
            return;
        }

        await this.processStatement(count, question);
        await this.processQuestion(count, question);
        await this.processAction(question);
        await this.processMultipleActions(question);
    }

    /**
     * Writes a statement to the console
     * 
     * @param question 
     * @returns 
     */
    processStatement = async (count: number, question: QuestionDTO) => {
        if (!question.statement) {
            return;
        }

        this.writeLine(`[${count}]: ${question.getText()}`);
        this.writeLine();
        await this.input.waitForEnter();
    }

    /**
     * Asks a question to the user
     * 
     * @param question 
     * @returns 
     */
    processQuestion = async (count: number, question: QuestionDTO) => {
        if (question.statement) {
            return;
        }

        this.writeLine(`[${count}]: ${question.getText()}`);

        if (question.defaultValue) {
            this.writeLine(`Default: ${question.defaultValue}`);
        }

        question.answer = await this.input.askQuestion('');

        if (question.acceptedAnswers && !question.acceptedAnswers.includes(question.answer)) {
            this.writeLine(`Unexpected answer. Please try again.`);
            await this.input.waitForEnter();
            return await this.processQuestion(count, question);
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

    /**
     * Runs multiple actions
     * 
     * @param question 
     * @returns 
     */
    processMultipleActions = async (question: QuestionDTO) => {
        if (!question.actionCtors) {
            return;
        }

        for (const actionCtor of question.actionCtors) {
            const action = new actionCtor();
            await action.handle(this, question);
        }
    }
}

export default AppSetupCommand