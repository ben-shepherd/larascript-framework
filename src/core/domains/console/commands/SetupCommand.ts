import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import readline from 'node:readline';
import { StatementActions } from "@src/core/domains/console/consts/QuestionConsts";
import QuestionDTO from "@src/core/domains/console/data/QuestionDTO";
import { StatementActionCtor } from "@src/core/domains/console/interfaces/IStatementAction";
import EnvService from "@src/core/domains/console/service/EnvService";

export default class SetupCommand extends BaseCommand {

    signature: string = 'app:setup';

    rl: readline.Interface;

    envService: EnvService;

    constructor() {
        super();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.envService = new EnvService();
    }

    /**
     * Writes a line to the console
     * @param text 
     */
    writeLine = (text: string = '') => {
        this.rl.write(text + '\n');
    }

    /**
     * Asks the user questions and processes them
     */
    execute = async () => {
        const questionsAll = QuestionDTO.all();

        this.writeLine('--- App Setup ---');
        this.writeLine();

        this.writeLine('Preview of the questions:');
        for (const i in questionsAll) {
            const question = questionsAll[i];
            this.writeLine(`- ${question.text}`);
        }

        this.writeLine();
        await this.waitForEnter('When ready, press Enter to continue');

        for (const question of questionsAll) {
            const answeredQuestion = await this.promptUserForAnswer(question);

            await this.processAnswer(answeredQuestion);
        }

        this.rl.close();
        
        process.nextTick(() => process.exit(0));
    }

    /**
     * Prompts the user for an answer
     * 
     * @param question 
     * @returns 
     */
    promptUserForAnswer = async (question: QuestionDTO): Promise<QuestionDTO> => {
        if (question.isStatement) {
            this.writeLine(question.text);
            this.writeLine();
            await this.waitForEnter();
            return question;
        }

        this.writeLine(question.text);

        if (question.defaultValue) {
            this.writeLine(`Default: ${question.defaultValue}`);
        }

        return new Promise(resolve => {
            this.rl.question('', value => {
                question.answer = value;
                resolve(question);
            })
        })
    }

    /**
     * Processes the statement and runs an action
     * Alternatively, Updates the values in the environment
     * 
     * @param question 
     */
    processAnswer = async (question: QuestionDTO) => {
        await this.processStatement(question);
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
    processStatement = async (question: QuestionDTO) => {
        if (!question.isStatement) {
            return;
        }

        if (StatementActions[question.questionKey]) {
            const statementActionCtor: StatementActionCtor = StatementActions[question.questionKey];

            // Execute the action
            await new statementActionCtor().handle(this, question.answer);
            this.writeLine();
        }
    }

    /**
     * Updates the values in the environment
     * 
     * @param question 
     * @returns 
     */
    processInput = async (question: QuestionDTO) => {
        if (question.isStatement) {
            return;
        }

        let value: string = this.normalizeValueFromAnswer(question);

        await this.envService.updateValues({ [question.questionKey]: value });
    }

    /**
     * Wait for enter input
     * @param text 
     * @returns 
     */
    waitForEnter = (text = 'Press Enter to continue'): Promise<void> => {
        return new Promise((resolve) => {
            this.rl.question(text, () => {
                resolve()
            })
        })
    }

    /**
     * Normalize the value from the answer
     * 
     * @param question 
     * @returns 
     */
    normalizeValueFromAnswer = (question: QuestionDTO) => {
        let value: string = question.answer ?? '';

        if (!value.length && question.defaultValue) {
            value = question.defaultValue;
        }

        if (value.toLowerCase() === 'y' || value.toLowerCase() === 'yes') {
            value = 'true';
        }

        if (value.toLowerCase() === 'n' || value.toLowerCase() === 'no') {
            value = 'false';
        }

        return value;
    }
}