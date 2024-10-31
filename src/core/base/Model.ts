/* eslint-disable no-unused-vars */
import { IDatabaseDocument, IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import { IBelongsToOptions } from '@src/core/domains/database/interfaces/relationships/IBelongsTo';
import { IHasManyOptions } from '@src/core/domains/database/interfaces/relationships/IHasMany';
import { ICtor } from '@src/core/interfaces/ICtor';
import { GetDataOptions, IModel } from '@src/core/interfaces/IModel';
import IModelAttributes from '@src/core/interfaces/IModelData';
import { App } from '@src/core/services/App';
import Str from '@src/core/util/str/Str';

import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { ObserveConstructor } from '@src/core/domains/observer/interfaces/IHasObserver';
import { IObserver } from '@src/core/domains/observer/interfaces/IObserver';
import BaseModel from '@src/core/base/BaseModel';
 

/**
 * Abstract base class for database models.
 * Extends WithObserver to provide observation capabilities.
 * Implements IModel interface for consistent model behavior.
 * 
 * @template Attributes Type extending IModelData, representing the structure of the model's data.
 */
export default abstract class Model<Attributes extends IModelAttributes> extends BaseModel implements IModel<Attributes> {

    public name!: string;

    /**
     * The primary key field name for the model.
     * Defaults to 'id'.
     */
    public primaryKey: string = 'id';
    
    /**
     * List of fields that are allowed to be set on the model.
     * Acts as a whitelist for mass assignment.
     */
    public fields: string[] = [];

    /**
     * List of fields that should be excluded when retrieving data.
     * Only applied when excludeGuarded is set to true in getData options.
     */
    public guarded: string[] = [];

    /**
     * List of fields that should be treated as dates.
     * These fields will be automatically managed if timestamps is true.
     */
    public dates: string[] = ['createdAt', 'updatedAt'];

    /**
     * Flag to enable automatic timestamp management.
     * When true, createdAt and updatedAt fields are automatically set.
     */
    public timestamps: boolean = true;

    /**
     * Constructs a new instance of the Model class.
     * 
     * @param {Attributes | null} data - Initial data to populate the model.
     */
    constructor(data: Attributes | null) {
        super();
        this.name = this.constructor.name;
        this.setDefaultTable();
        this.attributes = { ...data } as Attributes;
        this.original = { ...data } as Attributes;
    }

    /**
     * Declare HasDatabaseConnection concern
     */
    declare connection: string;

    declare table: string;

    declare getDocumentManager: () => IDocumentManager;

    declare getSchema: () => IDatabaseSchema;

    /**
     * Declare HasPrepareDocument concern
     */
    declare json: string[];
    
    declare prepareDocument: <T>() => T;

    /**
     * Declare HasAttributes concern
     */
    declare attributes: Attributes | null;

    declare original: Attributes | null;

    declare attr: <T extends keyof Attributes>(key: T, value?: unknown) => Attributes[T] | null | undefined;

    declare getAttribute: <T extends keyof Attributes>(key: T) => Attributes[T] | null

    declare getAttributes: () => Attributes | null;

    declare getOriginal: <T extends keyof Attributes>(key: T) => Attributes[T] | null

    declare setAttribute: <T extends keyof Attributes>(key: T, value: Attributes[T]) => Promise<void>;

    declare getDirty: () => Record<keyof Attributes, any> | null;

    declare isDirty: () => boolean;
    
    /**
     * Delcare HasObserver concern
     */
    declare observer?: IObserver;

    declare observe: () => void;

    declare observeProperties: Record<string, string>;

    declare observeWith: (observedBy: ObserveConstructor) => any;

    declare observeData: <T>(name: string, data: T) => Promise<T>

    declare observeDataCustom: <T>(name: keyof any, data: T) => Promise<T>


    /**
     * Sets the default table name if not explicitly defined.
     * Uses the pluralized, lower-cased version of the class name.
     */
    protected setDefaultTable() {
        if (this.table) {
            return;
        }
        this.table = this.constructor.name;

        if (this.table.endsWith('Model')) {
            this.table = this.table.slice(0, -5);
        }

        this.table = Str.plural(Str.startLowerCase(this.table))

    }

    /**
     * Retrieves the primary key value of the model.
     * 
     * @returns {string | undefined} The primary key value or undefined if not set.
     */
    getId(): string | undefined {
        return this.attributes?.[this.primaryKey] as string | undefined;
    }

    /**
     * Sets a timestamp on a Date field.
     * 
     * @param {string} dateTimeField - The name of the date field to update.
     * @param {Date} [value=new Date()] - The date value to set.
     */
    async setTimestamp(dateTimeField: string, value: Date = new Date()) {
        if (!this.timestamps || !this.dates.includes(dateTimeField)) {
            return;
        }
        this.setAttribute(dateTimeField, value as Attributes[string]);
    }

    /**
     * Fills the model with the provided data.
     * 
     * @param {Partial<Attributes>} data - The data to fill the model with.
     */
    async fill(data: Partial<Attributes>): Promise<void> {
        for (const [key, value] of Object.entries(data)) {
            if(value === undefined) {
                continue;
            }

            await this.setAttribute(key, value);
        }
    }

    /**
     * Retrieves the data from the model.
     * 
     * @param {GetDataOptions} [options={ excludeGuarded: true }] - Options for data retrieval.
     * @returns {Attributes | null} The model's data, potentially excluding guarded fields.
     */
    async getData(options: GetDataOptions = { excludeGuarded: true }): Promise<Attributes | null> {
        let data = this.getAttributes();

        if (data && options.excludeGuarded) {
            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => !this.guarded.includes(key))
            ) as Attributes;
        }

        return data as Attributes;
    }

    /**
     * Refreshes the model's data from the database.
     * 
     * @returns {Promise<Attributes | null>} The refreshed data or null if the model has no ID.
     */
    async refresh(): Promise<Attributes | null> {
        const id = this.getId();

        if (!id) return null;

        this.attributes = await this.getDocumentManager().findById(id);
        this.original = { ...this.attributes } as Attributes

        return this.attributes as Attributes;
    }

    /**
     * Updates the model in the database.
     * 
     * @returns {Promise<void>}
     */
    async update(): Promise<void> {
        if (!this.getId() || !this.attributes) return;

        await this.getDocumentManager().updateOne(this.prepareDocument());
    }


    /**
     * Saves the model to the database.
     * Handles both insertion of new records and updates to existing ones.
     * 
     * @returns {Promise<void>}
     */
    async save(): Promise<void> {
        if (this.attributes && !this.getId()) {
            this.attributes = await this.observeData('creating', this.attributes);
            await this.setTimestamp('createdAt');
            await this.setTimestamp('updatedAt');

            this.attributes = await this.getDocumentManager().insertOne(this.prepareDocument());
            this.attributes = await this.refresh();

            this.attributes = await this.observeData('created', this.attributes);
            return;
        }

        this.attributes = await this.observeData('updating', this.attributes);
        this.setTimestamp('updatedAt');
        await this.update();
        this.attributes = await this.refresh();
        this.attributes = await this.observeData('updated', this.attributes);
        this.original = { ...this.attributes } as Attributes
    }

    /**
     * Deletes the model from the database.
     * 
     * @returns {Promise<void>}
     */
    async delete(): Promise<void> {
        if (!this.attributes) return;
        this.attributes = await this.observeData('deleting', this.attributes);
        await this.getDocumentManager().deleteOne(this.attributes as IDatabaseDocument);
        this.attributes = null;
        this.original = null;
        await this.observeData('deleted', this.attributes);
    }

    /**
     * Retrieves a related model based on a "belongs to" relationship.
     * 
     * @template T The type of the related model.
     * @param {ICtor<T>} foreignModel - The constructor of the related model.
     * @param {Omit<IBelongsToOptions, 'foreignTable'>} options - Options for the relationship.
     * @returns {Promise<T | null>} The related model instance or null if not found.
     */
    async belongsTo<T extends IModel = IModel>(foreignModel: ICtor<T>, options: Omit<IBelongsToOptions, 'foreignTable'>): Promise<T | null> {
        const documentManager = App.container('db').documentManager(this.connection);

        if (!this.attributes) {
            return null;
        }

        const result = await documentManager.belongsTo(this.attributes, {
            ...options,
            foreignTable: (new foreignModel()).table
        });

        if (!result) {
            return null;
        }

        return new foreignModel(result);
    }

    /**
     * Retrieves related models based on a "has many" relationship.
     * 
     * @template T The type of the related models.
     * @param {ICtor<T>} foreignModel - The constructor of the related model.
     * @param {Omit<IHasManyOptions, 'foreignTable'>} options - Options for the relationship.
     * @returns {Promise<T[]>} An array of related model instances.
     */
    public async hasMany<T extends IModel = IModel>(foreignModel: ICtor<T>, options: Omit<IHasManyOptions, 'foreignTable'>): Promise<T[]> {
        const documentManager = App.container('db').documentManager(this.connection);

        if (!this.attributes) {
            return [];
        }

        const results = await documentManager.hasMany(this.attributes, {
            ...options,
            foreignTable: (new foreignModel()).table
        });

        return (results as unknown[]).map((document) => new foreignModel(document));
    }

}