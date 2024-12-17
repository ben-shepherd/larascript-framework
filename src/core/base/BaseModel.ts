/* eslint-disable no-unused-vars */

import HasObserverConcern from '@src/core/concerns/HasObserverConcern';
import Broadcaster from '@src/core/domains/broadcast/abstract/Broadcaster';
import { IBroadcastListener, IBroadcastSubscribeOptions } from '@src/core/domains/broadcast/interfaces/IBroadcaster';
import { ObserveConstructor } from '@src/core/domains/observer/interfaces/IHasObserver';
import { IObserver } from '@src/core/domains/observer/interfaces/IObserver';
import compose from '@src/core/util/compose';

class BaseModel extends compose(class extends Broadcaster {}, HasObserverConcern) {

    /**
   * Declare HasBroadcaster concern
   */
    declare broadcastDispatch: (listener: IBroadcastListener) => Promise<void>;

    declare broadcastSubscribe: <Listener extends IBroadcastListener = IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>) => void;

    declare broadcastSubscribeOnce: <Listener extends IBroadcastListener = IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>) => void;
    
        
    /**
     * Delcare HasObserver concern
     */
    declare observer?: IObserver;
    
    declare observe: () => void;
    
    declare observeProperties: Record<string, string>;
    
    declare observeWith: (observedBy: ObserveConstructor, allowOverride?: boolean) => any;
    
    declare observeData: <T>(name: string, data: T) => Promise<T>
    
    declare observeDataCustom: <T>(name: keyof any, data: T) => Promise<T>

}

export default BaseModel