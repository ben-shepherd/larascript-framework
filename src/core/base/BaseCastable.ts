import HasCastableConcern from "@src/core/concerns/HasCastableConcern";
import { IHasCastableConcern } from "@src/core/interfaces/concerns/IHasCastableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

const BaseCastable: ICtor<IHasCastableConcern> = compose(class {}, HasCastableConcern)

export default BaseCastable