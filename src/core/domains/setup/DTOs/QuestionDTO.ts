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

class QuestionDTO {

    public id: string;

    public question: string | null;

    public statement: string | null;

    public previewText: string | null;

    public defaultValue: string | null;
 
    public answer: string | null = null;

    public actionCtor: ActionCtor | null = null;

    public actionCtors: ActionCtor[] | null = null;

    public acceptedAnswers: string[] | null = null;

    public applicableOnly: ApplicableOnly | null = null

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

    public getText(): string {
        if(this.question) {
            return this.question
        }
        return this.statement as string
    }

    public getAnswer(): string | null {
        if(this.answer?.length === 0) {
            return this.defaultValue
        }
        return this.answer
    }

    public getPreviewText(): string | null {
        if(!this.previewText) {
            return this.getText()
        }
        return this.previewText
    }

}

export default QuestionDTO