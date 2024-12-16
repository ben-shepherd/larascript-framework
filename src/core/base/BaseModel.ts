/* eslint-disable no-unused-vars */

import HasObserverConcern from '@src/core/concerns/HasObserverConcern';
import Broadcaster from '@src/core/domains/broadcast/abstract/Broadcaster';
import { ObserveConstructor } from '@src/core/domains/observer/interfaces/IHasObserver';
import { IObserver } from '@src/core/domains/observer/interfaces/IObserver';
import compose from '@src/core/util/compose';

import { IBroadcastEvent } from '../domains/broadcast/interfaces/IBroadcastEvent';
import { BroadcastCallback } from '../domains/broadcast/interfaces/IBroadcaster';

class BaseModel extends compose(class extends Broadcaster {}, HasObserverConcern) {

    /**
   * Declare HasBroadcaster concern
   */
    declare broadcast: (event: IBroadcastEvent) => Promise<void>;

    declare createBroadcastListener: (eventName: string) => void;

    declare subscribeToBroadcastListener: (id: string, eventName: string, callback: BroadcastCallback) => void;

    declare unsubscribeFromBroadcastListener: (id: string, eventName: string) => void;
    
        
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