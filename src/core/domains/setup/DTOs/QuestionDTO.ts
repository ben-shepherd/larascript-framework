import { ActionCtor } from "../interfaces/IAction";

type Props = {
    id: string;
    question?: string | null;
    statement?: string | null;
    defaultValue?: string | null;
    answer?: string | null;
    actionCtor?: ActionCtor | null;
    acceptedAnswers?: string[] | null;
}

class QuestionDTO
{
    public id: string;
    public question: string | null;
    public statement: string | null;
    public defaultValue: string | null; 
    public answer: string | null = null;
    public actionCtor: ActionCtor | null = null;
    public acceptedAnswers: string[] | null = null;

    constructor({
        id,
        question = null,
        statement = null,
        defaultValue = null,
        answer = null,
        actionCtor = null,
        acceptedAnswers = null
    }: Props) 
    {
        if(!question && !statement) {
            throw new Error('Missing question or statement')
        }

        this.id = id;
        this.question = question;
        this.statement = statement;
        this.defaultValue = defaultValue;
        this.answer = answer;
        this.actionCtor = actionCtor;
        this.acceptedAnswers = acceptedAnswers;
    }

    public getText(): string {
        if(this.question) {
            return this.question
        }
        return this.statement as string
    }
}

export default QuestionDTO