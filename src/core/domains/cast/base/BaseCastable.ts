import { compose } from "@ben-shepherd/larascript-core-bundle";
import HasCastableConcern from "@src/core/domains/cast/concerns/HasCastableConcern";
import { IHasCastableConcern } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

const BaseCastable: TClassConstructor<IHasCastableConcern> = compose(class {}, HasCastableConcern)

export default BaseCastable