import { IHasCastableConcern } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import compose from "@src/core/util/compose";

import HasCastableConcern from "../concerns/HasCastableConcern";

const BaseCastable: TClassConstructor<IHasCastableConcern> = compose(class {}, HasCastableConcern)

export default BaseCastable