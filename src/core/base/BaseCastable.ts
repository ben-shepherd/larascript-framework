import HasCastableConcern from "@src/core/concerns/HasCastableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import { IHasCastableConcern } from "../interfaces/concerns/IHasCastableConcern";

const BaseCastable: ICtor<IHasCastableConcern> = compose(class {}, HasCastableConcern)

export default BaseCastable