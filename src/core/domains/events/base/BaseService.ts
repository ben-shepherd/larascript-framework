import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import EventMockableConcern from "@src/core/domains/events/concerns/EventMockableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import EventWorkerConcern from "../concerns/EventWorkerConcern";

const BaseService: ICtor = compose(
    class {},
    HasRegisterableConcern,
    EventWorkerConcern,
    EventMockableConcern,
);

export default BaseService