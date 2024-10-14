import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import { IBelongsToOptions } from '@src/core/domains/database/interfaces/relationships/IBelongsTo';
import { IHasManyOptions } from '@src/core/domains/database/interfaces/relationships/IHasMany';
import { IObserver } from '@src/core/domains/observer/interfaces/IObserver';
import { WithObserver } from '@src/core/domains/observer/services/WithObserver';
import UnexpectedAttributeError from '@src/core/exceptions/UnexpectedAttributeError';
import { ICtor } from '@src/core/interfaces/ICtor';
import { GetDataOptions, IModel } from '@src/core/interfaces/IModel';
import IModelAttributes from '@src/core/interfaces/IModelData';
import { App } from '@src/core/services/App';
import Str from '@src/core/util/str/Str';


/**
 * Abstract base class for database models.
 * Extends WithObserver to provide observation capabilities.
 * Implements IModel interface for consistent model behavior.
 * 
 * @template Attributes Type extending IModelData, representing the structure of the model's data.
 */
export default abstract class Model<Attributes extends IModelAttributes> extends WithObserver<Attributes> implements IModel<Attributes> {

    public name!: string;

    /**
     * The name of the database connection to use.
     * Defaults to the application's default connection name.
     */
    public connection: string = App.container('db').getDefaultConnectionName();

    /**
     * The primary key field name for the model.
     * Defaults to 'id'.
     */
    public primaryKey: string = 'id';

    /**
     * The actual data of the model.
     * Can be null if the model hasn't been populated.
     */
    public attributes: Attributes | null = null;

    /**
     * The original data of the model.
     * Can be null if the model hasn't been populated.
     */
    public original: Attributes | null = null;

    /**
     * The name of the MongoDB collection associated with this model.
     * Must be set by child classes or will be automatically generated.
     */
    public table!: string;

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
     * List of fields that should be treated as JSON.
     * These fields will be automatically stringified when saving to the database.
     */
    public json: string[] = [];

    /**
     * Custom observation methods for specific properties.
     * Key is the property name, value is the name of the custom observation method.
     */
    public observeProperties: Record<string, string> = {};

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
     * Gets the document manager for database operations.
     * 
     * @returns {IDocumentManager} The document manager instance.
     */
    getDocumentManager(): IDocumentManager {
        return App.container('db').documentManager(this.connection).table(this.table);
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
     * Sets or retrieves the value of a specific attribute from the model's data.
     * If called with a single argument, returns the value of the attribute.
     * If called with two arguments, sets the value of the attribute.
     * If the value is not set, returns null.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve or set.
     * @param {any} [value] - The value to set for the attribute.
     * @returns {Attributes[K] | null | undefined} The value of the attribute or null if not found, or undefined if setting.
     */
    attr<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Attributes[K] | null | undefined {
        if (value === undefined) {
            return this.getAttribute(key) as Attributes[K] ?? null;
        }

        this.setAttribute(key, value);
        return undefined;
    }

    /**
     * Retrieves the value of a specific attribute from the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Attributes[K] | null} The value of the attribute or null if not found.
     */
    getAttribute<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null {
        return this.attributes?.[key] ?? null;
    }

    /**
     * Retrieves the original value of a specific attribute from the model's original data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Attributes[K] | null} The original value of the attribute or null if not found.
     */
    getOriginal<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null {
        return this.original?.[key] ?? null;
    }

    /**
     * Checks if the model is dirty.
     * 
     * A model is considered dirty if any of its attributes have changed since the last time the model was saved.
     * 
     * @returns {boolean} True if the model is dirty, false otherwise.
     */
    isDirty(): boolean {
        if(!this.original) {
            return false;
        }
        return Object.keys(this.getDirty() ?? {}).length > 0;
    }

    /**
     * Gets the dirty attributes.
     * @returns 
     */
    getDirty(): Record<keyof Attributes, any> | null {

        const dirty = {} as Record<keyof Attributes, any>;

        Object.entries(this.attributes as object).forEach(([key, value]) => {

            try {
                if (typeof value === 'object' && JSON.stringify(value) !== JSON.stringify(this.original?.[key])) {
                    dirty[key as keyof Attributes] = value;
                    return;
                }
            }
            // eslint-disable-next-line no-unused-vars
            catch (e) { }

            if (value !== this.original?.[key]) {
                dirty[key as keyof Attributes] = value;
            }
        });

        return dirty;
    }

    /**
     * Sets the value of a specific attribute in the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to set.
     * @param {any} value - The value to set for the attribute.
     * @throws {Error} If the attribute is not in the allowed fields or if a date field is set with a non-Date value.
     */
    setAttribute<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): void {
        if (!this.fields.includes(key as string)) {
            throw new UnexpectedAttributeError(`Unexpected attribute '${key as string}'`);
        }
        if (this.dates.includes(key as string) && !(value instanceof Date)) {
            throw new UnexpectedAttributeError(`Unexpected attribute value. Expected attribute '${key as string}' value to be of type Date`);
        }
        if (this.attributes === null) {
            this.attributes = {} as Attributes;
        }
        if (this.attributes) {
            this.attributes[key] = value as Attributes[K];
        }

        if (Object.keys(this.observeProperties).includes(key as string)) {
            this.observeDataCustom(this.observeProperties[key as string] as keyof IObserver<any>, this.attributes).then((data) => {
                this.attributes = data;
            })
        }
    }

    /**
     * Sets a timestamp on a Date field.
     * 
     * @param {string} dateTimeField - The name of the date field to update.
     * @param {Date} [value=new Date()] - The date value to set.
     */
    setTimestamp(dateTimeField: string, value: Date = new Date()) {
        if (!this.timestamps || !this.dates.includes(dateTimeField)) {
            return;
        }
        this.setAttribute(dateTimeField, value);
    }

    /**
     * Fills the model with the provided data.
     * 
     * @param {Partial<Attributes>} data - The data to fill the model with.
     */
    fill(data: Partial<Attributes>): void {
        Object.entries(data)
            // eslint-disable-next-line no-unused-vars
            .filter(([_key, value]) => value !== undefined)
            .forEach(([key, value]) => {
                this.setAttribute(key, value);
            });
    }

    /**
     * Retrieves the data from the model.
     * 
     * @param {GetDataOptions} [options={ excludeGuarded: true }] - Options for data retrieval.
     * @returns {Attributes | null} The model's data, potentially excluding guarded fields.
     */
    getData(options: GetDataOptions = { excludeGuarded: true }): Attributes | null {
        let data = this.attributes;

        if (data && options.excludeGuarded) {
            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => !this.guarded.includes(key))
            ) as Attributes;
        }

        return data;
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

        return this.attributes;
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
     * Prepares the document for saving to the database.
     * Handles JSON stringification for specified fields.
     * 
     * @template T The type of the prepared document.
     * @returns {T} The prepared document.
     */
    prepareDocument<T>(): T {
        return this.getDocumentManager().prepareDocument({ ...this.attributes }, {
            jsonStringify: this.json
        }) as T;
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
            this.setTimestamp('createdAt');
            this.setTimestamp('updatedAt');

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
        this.original = { ...this.attributes }
    }

    /**
     * Deletes the model from the database.
     * 
     * @returns {Promise<void>}
     */
    async delete(): Promise<void> {
        if (!this.attributes) return;
        this.attributes = await this.observeData('deleting', this.attributes);
        await this.getDocumentManager().deleteOne(this.attributes);
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