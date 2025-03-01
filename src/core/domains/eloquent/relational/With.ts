import { db } from "@src/core/domains/database/services/Database";
import BaseRelationshipResolver from "@src/core/domains/eloquent/base/BaseRelationshipResolver";
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { ICtor } from "@src/core/interfaces/ICtor";

class With {

    constructor(
        // eslint-disable-next-line no-unused-vars
        protected eloquent: IEloquent,
        // eslint-disable-next-line no-unused-vars
        protected relationshipName: string
    ) {}

    /**
     * Applies the relationship to the Eloquent expression. This method is responsible for updating the Eloquent expression
     * with the relationship details. It will join the relationship table with the local table using the relationship
     * instance's getForeignModelCtor and getLocalModelCtor methods to retrieve the foreign table and the local table
     * respectively. The join type is a left join. The relationship's getLocalKey and getForeignKey methods are used to
     * specify the join columns.
     * @return {IEloquent<Model, Attributes>} The Eloquent instance.
     */
    updateEloquent() {

        const eloquent = this.eloquent.clone()

        const resolver = db().getAdapter().getRelationshipResolver()

        const relationshipInterface = BaseRelationshipResolver.resolveRelationshipInterfaceByModelRelationshipName(eloquent.getModelCtor() as ICtor<IModel>, this.relationshipName)

        return resolver.attachEloquentRelationship(eloquent, relationshipInterface, this.relationshipName)
    }

}

export default With