
import HasAttributesConcern from '@src/core/concerns/HasAttributesConcern';
import HasDatabaseConnectionConcern from '@src/core/concerns/HasDatabaseConnectionConcern';
import HasObserverConcern from '@src/core/concerns/HasObserverConcern';
import HasPrepareDocumentConcern from '@src/core/concerns/HasPrepareDocumentConcern';
import Broadcaster from '@src/core/domains/broadcast/abstract/Broadcaster';
import { ICtor } from '@src/core/interfaces/ICtor';
import compose from '@src/core/util/compose';

const BaseModel: ICtor = compose(
    class extends Broadcaster {},
    HasDatabaseConnectionConcern,
    HasPrepareDocumentConcern,
    HasAttributesConcern,
    HasObserverConcern
)

export default BaseModel