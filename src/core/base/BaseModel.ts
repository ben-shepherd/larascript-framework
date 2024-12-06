/* eslint-disable no-unused-vars */

import HasDatabaseConnectionConcern from '@src/core/concerns/HasDatabaseConnectionConcern';
import HasObserverConcern from '@src/core/concerns/HasObserverConcern';
import HasPrepareDocumentConcern from '@src/core/concerns/HasPrepareDocumentConcern';
import Broadcaster from '@src/core/domains/broadcast/abstract/Broadcaster';
import compose from '@src/core/util/compose';

import { IDatabaseSchema } from '../domains/database/interfaces/IDatabaseSchema';
import { IDocumentManager } from '../domains/database/interfaces/IDocumentManager';
import { ObserveConstructor } from '../domains/observer/interfaces/IHasObserver';
import { IObserver } from '../domains/observer/interfaces/IObserver';
import IModelAttributes from '../interfaces/IModelData';

class BaseModel<Attributes extends IModelAttributes = IModelAttributes> extends compose(
    class extends Broadcaster {},
    HasDatabaseConnectionConcern,
    HasPrepareDocumentConcern,
    HasObserverConcern
) {

    /**
     * Declare HasDatabaseConnection concern
     */
    declare connection: string;

    declare table: string;
    
    declare getDocumentManager: () => IDocumentManager;

    declare setConnectionName: (connectionName: string) => void;
    
    declare getSchema: () => IDatabaseSchema;
    
    /**
      * Declare HasPrepareDocument concern
      */
    declare json: string[];
        
    declare prepareDocument: <T>() => T;
    
        
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