import { ICtor } from "@src/core/interfaces/ICtor";

import IEloquentExpression from "../interfaces/IEloquentExpression";

const ExpressionConcernMixin = (Base: ICtor) => {
    return class ExpressionConcern extends Base {
        
        /**
         * The constructor of the expression builder
         */
        protected expressionCtor!: ICtor<IEloquentExpression>;

        /**
         * The expression builder
         */
        protected expression!: IEloquentExpression;

        /**
         * Sets the expression builder to use for the query builder.
         * 
         * @param {ICtor<IEloquentExpression>} builderCtor The constructor of the expression builder to use.
         * @returns {this} The query builder instance for chaining.
         */
        protected setExpressionCtor(builderCtor: ICtor<IEloquentExpression>): this {
            this.expressionCtor = builderCtor;
            this.expression = new builderCtor();
            return this
        }

    
    }
}

export default ExpressionConcernMixin