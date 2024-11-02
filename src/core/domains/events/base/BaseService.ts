import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

const BaseService: ICtor = compose(
    class {},
    HasRegisterableConcern,
);

export default BaseService