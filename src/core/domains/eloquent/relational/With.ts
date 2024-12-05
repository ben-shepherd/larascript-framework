import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import ExpressionException from "../exceptions/ExpressionException";
import { IEloquent, IRelationship } from "../interfaces/IEloquent";
import BelongsTo from "./BelongsTo";

class With<Data> {

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected eloquent: IEloquent<Data>,
        // eslint-disable-next-line no-unused-vars
        protected relationship: string
    ) {}

    /**
     * Applies the relationship to the Eloquent expression. This method is responsible for updating the Eloquent expression
     * with the relationship details. It will join the relationship table with the local table using the relationship
     * instance's getForeignModelCtor and getLocalModelCtor methods to retrieve the foreign table and the local table
     * respectively. The join type is a left join. The relationship's getLocalKey and getForeignKey methods are used to
     * specify the join columns.
     * @return {IEloquent<Data>} The Eloquent instance.
     */
    applyOnExpression(): IEloquent<Data> {

        const relationship = this.getRelationInterface();

        if(relationship instanceof BelongsTo) {
            const localModelCtor = relationship.getLocalModelCtor();
            const foreignModelCtor = relationship.getForeignModelCtor();
            
            this.eloquent.getExpression()
                .join({
                    table: new localModelCtor(null).useTableName(),
                    rightTable: new foreignModelCtor(null).useTableName(),
                    leftColumn: relationship.getLocalKey(),
                    rightColumn: relationship.getForeignKey(),
                    type: 'left'
                })
        }

        return this.eloquent
    }

    /** 
     * Retrieves the relationship class instance from the provided Local model.
     *
     * @throws {ExpressionException} If the relationship is invalid.
     * @return {IRelationship} The relationship class instance.
     */
    protected getRelationInterface(): IRelationship {
        const modelCtor = this.eloquent.getModelCtor() as ICtor<IModel>;
        const model = new modelCtor(null);

        if(typeof model[this.relationship] !== 'function') {
            throw new ExpressionException('Invalid relationship \'' + this.relationship + '\'');
        }

        const relationship = model[this.relationship]() as IRelationship;

        if(relationship?._relationshipInterface !== true) {
            throw new ExpressionException('Invalid relationship \'' + this.relationship + '\'');
        }

        return relationship
    }

}

export default With