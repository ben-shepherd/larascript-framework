import { ActionCtor } from "@src/core/domains/setup/interfaces/IAction";

type ApplicableOnly = {
    ifId: string,
    answerIncludes: string[]
}

type Props = {
    id: string;
    question?: string | null;
    statement?: string | null;
    defaultValue?: string | null;
    previewText?: string | null;
    answer?: string | null;
    actionCtor?: ActionCtor | null;
    actionCtors?: ActionCtor[] | null;
    acceptedAnswers?: string[] | null;
    applicableOnly?: ApplicableOnly | null
}


/**
 * Data Transfer Object for questions in the setup process
 */
class QuestionDTO {

    /**
     * Unique identifier for the question
     */
    public id: string;

    /**
     * The question that will be asked to the user
     */
    public question: string | null;

    /**
     * The statement to be displayed to the user. If this is null, question will be used.
     */
    public statement: string | null;

    /**
     * The text to be displayed as the preview for the question.
     * If this is not set, the question or statement will be used.
     */
    public previewText: string | null;

    /**
     * The default value of the answer. If the user does not answer, this will be used.
     */
    public defaultValue: string | null;
 
    /**
     * The answer given by the user. If null, the default value will be used.
     */
    public answer: string | null = null;

    /**
     * The action constructor to be used for the answer of this question.
     */
    public actionCtor: ActionCtor | null = null;

    /**
     * The action constructors to be used for the answer of this question.
     */
    public actionCtors: ActionCtor[] | null = null;

    /**
     * The accepted answers for this question. If not set, the user will be reprompted.
     */
    public acceptedAnswers: string[] | null = null;

    /**
     * The conditions under which this question should be asked.
     * If not set, the question will be asked regardless of the previous answers.
     */
    public applicableOnly: ApplicableOnly | null = null

    /**
     * Constructor for the QuestionDTO
     * @param {Props} props The properties for the QuestionDTO
     */
    constructor({
        id,
        question = null,
        statement = null,
        previewText = null,
        defaultValue = null,
        answer = null,
        actionCtor = null,
        actionCtors = null,
        acceptedAnswers = null,
        applicableOnly = null
    }: Props) {
        if(!question && !statement) {
            throw new Error('Missing question or statement')
        }

        this.id = id;
        this.question = question;
        this.statement = statement;
        this.previewText = previewText;
        this.defaultValue = defaultValue;
        this.answer = answer;
        this.actionCtor = actionCtor;
        this.actionCtors = actionCtors;
        this.acceptedAnswers = acceptedAnswers;
        this.applicableOnly = applicableOnly
    }

    /**
     * Gets the text of the question. If the question is null, the statement is used.
     * @returns {string} The text of the question
     */
    public getText(): string {
        if(this.question) {
            return this.question
        }
        return this.statement as string
    }

    /**
     * Gets the answer of the question. If the answer is null, the default value is used.
     * @returns {string | null} The answer of the question
     */
    public getAnswer(): string | null {
        if(this.answer?.length === 0) {
            return this.defaultValue
        }
        return this.answer
    }

    /**
     * Gets the preview text of the question. If the previewText is null, the question or statement is used.
     * @returns {string | null} The preview text of the question
     */
    public getPreviewText(): string | null {
        if(!this.previewText) {
            return this.getText()
        }
        return this.previewText
    }

}

export default QuestionDTO
