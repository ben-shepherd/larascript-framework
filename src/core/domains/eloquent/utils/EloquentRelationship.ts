import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import ExpressionException from "../exceptions/ExpressionException";
import { IEloquent, IRelationship } from "../interfaces/IEloquent";
import BelongsTo from "../relational/BelongsTo";

class EloquentRelationship {

    /** 
     * Retrieves the relationship class instance from the provided Local model.
     *
     * @throws {ExpressionException} If the relationship is invalid.
     * @return {IRelationship} The relationship class instance.
     */
    static fromModel(modelCtor: ICtor<IModel>, relationshipName: string): IRelationship {
        const model = new modelCtor(null);

        if(typeof model[relationshipName] !== 'function') {
            throw new ExpressionException('Invalid relationship \'' + relationshipName + '\'');
        }

        const relationship = model[relationshipName]() as IRelationship;

        if(relationship?._relationshipInterface !== true) {
            throw new ExpressionException('Invalid relationship \'' + relationshipName + '\'');
        }

        return relationship
    }

    /**
     * Applies the relationship to the Eloquent expression.
     * 
     * @return {Eloquent} The Eloquent instance.
     */
    static applyRelationshipOnEloquent<Data>(eloquent: IEloquent<Data>, relationship: IRelationship, relationshipName: string): IEloquent<Data> {

        if(relationship instanceof BelongsTo) {
            const localModelCtor = relationship.getLocalModelCtor();
            const foreignModelCtor = relationship.getForeignModelCtor();
            const columnPrefix = `${relationshipName}_`;
            
            eloquent.getExpression()
                .join({
                    localTable: new localModelCtor(null).useTableName(),
                    relatedTable: new foreignModelCtor(null).useTableName(),
                    localColumn: relationship.getLocalKey(),
                    relatedColumn: relationship.getForeignKey(),
                    type: 'left'
                })
            eloquent.setModelColumns(foreignModelCtor, { columnPrefix, targetProperty: relationshipName})
        }

        return eloquent
    }

}

export default EloquentRelationship