/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
import IEloquentExpression from "@src/core/domains/eloquent/interfaces/IEloquentExpression";

export interface IExpressionConern {

        setExpressionCtor(builderCtor: ICtor<IEloquentExpression>): any;

}