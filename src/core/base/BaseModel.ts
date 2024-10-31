
import HasAttributes from '../concerns/HasAttributes/HasAttributes';
import HasObserver from '../concerns/HasObserver';
import Broadcaster from '../domains/broadcast/abstract/Broadcaster';
import { ICtor } from '../interfaces/ICtor';
import { IModel } from '../interfaces/IModel';
import compose from '../util/compose';

const BaseModel: ICtor<IModel> = compose(
    class extends Broadcaster {},
    HasAttributes,
    HasObserver
)

export default BaseModel