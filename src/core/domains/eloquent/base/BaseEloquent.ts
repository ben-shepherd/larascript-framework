/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import DocumentConcernMixin from "../concerns/DocumentConcern";
import ExpressionConcernMixin from "../concerns/ExpressionConcern";
import IEloquentExpression from "../interfaces/IEloquentExpression";

class BaseEloquent extends compose(class {}, DocumentConcernMixin, ExpressionConcernMixin) {
    
    /**
     *  DocumentConcern
     */
    declare documentWithUuid: <T>(document: T) => T;
    
    declare documentStripUndefinedProperties: <T>(document: T) => T;

    /**
     * Expression Concern
     */
    declare expressionCtor: ICtor<IEloquentExpression>;

    declare expression: IEloquentExpression;

    declare setExpressionCtor: (builderCtor: ICtor<IEloquentExpression>) => this;

}

export default BaseEloquent