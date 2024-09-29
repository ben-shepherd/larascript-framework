import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import { IBelongsToOptions } from '@src/core/domains/database/interfaces/relationships/IBelongsTo';
import { IHasManyOptions } from '@src/core/domains/database/interfaces/relationships/IHasMany';
import { IObserver } from '@src/core/domains/observer/interfaces/IObserver';
import { WithObserver } from '@src/core/domains/observer/services/WithObserver';
import { ICtor } from '@src/core/interfaces/ICtor';
import { GetDataOptions, IModel } from '@src/core/interfaces/IModel';
import IModelData from '@src/core/interfaces/IModelData';
import { App } from '@src/core/services/App';
import Str from '@src/core/util/str/Str';


/**
 * Abstract base class for database models.
 * Extends WithObserver to provide observation capabilities.
 * Implements IModel interface for consistent model behavior.
 * 
 * @template Data Type extending IModelData, representing the structure of the model's data.
 */
export default abstract class Model<Data extends IModelData> extends WithObserver<Data> implements IModel<Data> {

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
    public data: Data | null;

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
     * @param {Data | null} data - Initial data to populate the model.
     */
    constructor(data: Data | null) {
        super();
        this.data = data;
        this.name = this.constructor.name;
        this.setDefaultTable();
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

        if(this.table.endsWith('Model')) {
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
        return this.data?.[this.primaryKey];
    }

    /**
     * Retrieves the value of a specific attribute from the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Data[K] | null} The value of the attribute or null if not found.
     */
    getAttribute<K extends keyof Data = keyof Data>(key: K): Data[K] | null {
        return this.data?.[key] ?? null;
    }

    /**
     * Sets the value of a specific attribute in the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to set.
     * @param {any} value - The value to set for the attribute.
     * @throws {Error} If the attribute is not in the allowed fields or if a date field is set with a non-Date value.
     */
    setAttribute<K extends keyof Data = keyof Data>(key: K, value: any): void {
        if (!this.fields.includes(key as string)) {
            throw new Error(`Attribute ${key as string} not found in model ${this.constructor.name}`);
        }
        if (this.dates.includes(key as string) && !(value instanceof Date)) {
            throw new Error(`Attribute '${key as string}' is a date and can only be set with a Date object in model ${this.table}`);
        }
        if (this.data) {
            this.data[key] = value;
        }

        if (Object.keys(this.observeProperties).includes(key as string)) {
            this.observeDataCustom(this.observeProperties[key as string] as keyof IObserver<any>, this.data).then((data) => {
                this.data = data;
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
     * @param {Partial<Data>} data - The data to fill the model with.
     */
    fill(data: Partial<Data>): void {
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
     * @returns {Data | null} The model's data, potentially excluding guarded fields.
     */
    getData(options: GetDataOptions = { excludeGuarded: true }): Data | null {
        let data = this.data;

        if (data && options.excludeGuarded) {
            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => !this.guarded.includes(key))
            ) as Data;
        }

        return data;
    }

    /**
     * Refreshes the model's data from the database.
     * 
     * @returns {Promise<Data | null>} The refreshed data or null if the model has no ID.
     */
    async refresh(): Promise<Data | null> {
        const id = this.getId();

        if (!id) return null;

        this.data = await this.getDocumentManager().findById(id);

        return this.data;
    }

    /**
     * Updates the model in the database.
     * 
     * @returns {Promise<void>}
     */
    async update(): Promise<void> {
        if (!this.getId() || !this.data) return;

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
        return this.getDocumentManager().prepareDocument({ ...this.data }, {
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
        if (this.data && !this.getId()) {
            this.data = await this.observeData('creating', this.data);
            this.setTimestamp('createdAt');
            this.setTimestamp('updatedAt');

            this.data = await this.getDocumentManager().insertOne(this.prepareDocument());
            await this.refresh();

            this.data = await this.observeData('created', this.data);
            return;
        }

        this.data = await this.observeData('updating', this.data);
        this.setTimestamp('updatedAt');
        await this.update();
        await this.refresh();
        this.data = await this.observeData('updated', this.data);
    }

    /**
     * Deletes the model from the database.
     * 
     * @returns {Promise<void>}
     */
    async delete(): Promise<void> {
        if (!this.data) return;
        this.data = await this.observeData('deleting', this.data);
        await this.getDocumentManager().deleteOne(this.data);
        this.data = null;
        await this.observeData('deleted', this.data);
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

        if (!this.data) {
            return null;
        }

        const result = await documentManager.belongsTo(this.data, {
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

        if (!this.data) {
            return [];
        }

        const results = await documentManager.hasMany(this.data, {
            ...options,
            foreignTable: (new foreignModel()).table
        });

        return (results as unknown[]).map((document) => new foreignModel(document));
    }

}