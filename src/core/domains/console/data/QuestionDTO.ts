import { QuestionConstKeys, QuestionConsts, QuestionConstsDefaultValues, StatementConsts } from "../consts/QuestionConsts";

type Props = {
    questionKey: typeof QuestionConstKeys[number],
    isStatement: boolean,
    defaultValue: string,
    text: string,
    answer: string | null
}

class QuestionDTO
{
    public questionKey: typeof QuestionConstKeys[number];
    public isStatement: boolean = false
    public defaultValue!: string; 
    public text!: string;
    public answer: string | null = null;

    constructor({
        questionKey,
        isStatement = false,
        defaultValue = QuestionConstsDefaultValues[questionKey],
        text = QuestionConsts[questionKey],
        answer = null
    }: Props) 
    {
        this.questionKey = questionKey;
        this.isStatement = isStatement;
        this.defaultValue = defaultValue;
        this.text = text;
        this.answer = answer;
    }

    public static all(): QuestionDTO[] {
        return QuestionConstKeys.map((key) => {
            const isStatement = Boolean(StatementConsts[key]);
            const text = isStatement ? StatementConsts[key] : QuestionConsts[key];
            
            return new QuestionDTO({
                questionKey: key,
                isStatement,
                defaultValue: QuestionConstsDefaultValues[key],
                text,
                answer: null
            })
        })
    }
}

export default QuestionDTO