import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { IEloquent } from "../interfaces/IEloquent";
import EloquentRelationship from "../utils/EloquentRelationship";

class With<Data> {

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected eloquent: IEloquent<Data>,
        // eslint-disable-next-line no-unused-vars
        protected relationshipName: string
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

        const relationshipInterface = EloquentRelationship.fromModel(this.eloquent.getModelCtor() as ICtor<IModel>, this.relationshipName)

        EloquentRelationship.applyRelationshipOnEloquent<Data>(this.eloquent, relationshipInterface, this.relationshipName)

        return this.eloquent
    }

}

export default With