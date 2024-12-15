 
import BaseModel from '@src/core/base/BaseModel';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { db } from '@src/core/domains/database/services/Database';
import { IBelongsToOptions, IEloquent, IHasManyOptions, IRelationship, IdGeneratorFn } from '@src/core/domains/eloquent/interfaces/IEloquent';
import BelongsTo from '@src/core/domains/eloquent/relational/BelongsTo';
import HasMany from '@src/core/domains/eloquent/relational/HasMany';
import EloquentRelationship from '@src/core/domains/eloquent/utils/EloquentRelationship';
import OnAttributeChangeBroadcastEvent from '@src/core/events/concerns/HasAttribute/OnAttributeChangeBroadcastEvent';
import { ICtor } from '@src/core/interfaces/ICtor';
import { GetAttributesOptions, IModel, ModelConstructor } from '@src/core/interfaces/IModel';
import IModelAttributes from '@src/core/interfaces/IModelData';
import ProxyModelHandler from '@src/core/models/utils/ProxyModelHandler';
import { app } from '@src/core/services/App';
import Str from '@src/core/util/str/Str';
 

/**
 * Abstract base class for database models.
 * Extends WithObserver to provide observation capabilities.
 * Implements IModel interface for consistent model behavior.
 * 
 * @template Attributes Type extending IModelData, representing the structure of the model's data.
 */
export default abstract class Model<Attributes extends IModelAttributes> extends BaseModel implements IModel<Attributes> {

    protected idGeneratorFn: IdGeneratorFn | undefined;

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
     * List of relationships associated with the model.
     */
    public relationships: string[] = [];

    /**
     * The name of the database connection to use.
     * Defaults to the application's default connection name.
     */
    public connection: string = app('db').getDefaultConnectionName();

    /**
     * The name of the MongoDB collection associated with this model.
     * Must be set by child classes or will be automatically generated.
     */
    public table!: string;
    
    /**
     * Constructs a new instance of the Model class.
     * 
     * @param {Attributes | null} data - Initial data to populate the model.
     */
    constructor(data: Attributes | null) {
        super();
        this.attributes = { ...data } as Attributes;
        this.original = { ...data } as Attributes;
        if(!this.table) {
            this.table = this.getDefaultTable()
        }
    }
     
    /**
     * Gets the document manager for database operations.
     * 
     * @returns {IDocumentManager} The document manager instance.
     */
    setConnectionName(connectionName: string) {
        this.connection = connectionName;
    }
            
    /**
     * Gets the schema interface for the database.
     * 
     * @returns {IDatabaseSchema} The schema interface.
     */
    getSchema(): IDatabaseSchema {
        return db().schema(this.connection);
    }

    /**
     * Retrieves the current ID generator function for the query builder.
     *
     * @returns {IdGeneratorFn | undefined} The ID generator function.
     */
    getIdGeneratorFn(): IdGeneratorFn | undefined {
        return this.idGeneratorFn;
    }
    
    /**
     * Creates a new instance of the model wrapped in a Proxy.
     * 
     * This method uses the Proxy pattern to allow interception and customization of
     * property access and method calls on the model instance. It utilizes the ProxyModelHandler
     * to maintain proper 'this' context and provide additional features.
     * 
     * @template Model Extends IModel, representing the type of the model to create.
     * @param {Model['attributes'] | null} data - The initial data to populate the model.
     * @returns {Model} A new instance of the model wrapped in a Proxy.
     */
    static create<Model extends IModel>(data: Model['attributes'] | null = null): Model {
        return new Proxy(
            new (this as unknown as ICtor<Model>)(data),
            new ProxyModelHandler()
        )
    }

    /**
     * Retrieves the table name associated with the model.
     * 
     * @returns {string} The table name associated with the model.
     */
    static getTable(): string {
        return this.create().useTableName()
    }

    /**
     * Retrieves the default table name for the model.
     * The default table name is determined by the name of the model class.
     * If the model class name ends with 'Model', it is removed.
     * The table name is then pluralized and lowercased.
     * @returns The default table name.
     */
    protected getDefaultTable() {

        let table = this.constructor.name;

        if (table.endsWith('Model')) {
            table = table.slice(0, -5);
        }

        return Model.formatTableName(table);

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
    async attr<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Promise<Attributes[K] | null | undefined> {
        if (value === undefined) {
            return this.getAttribute(key) as Attributes[K] ?? null;
        }

        await this.setAttribute(key, value);
        return undefined;
    }
    
    /**
     * Sets or retrieves the value of a specific attribute from the model's data.
     * If called with a single argument, returns the value of the attribute.
     * If called with two arguments, sets the value of the attribute synchronously.
     * If the value is not set, returns null.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve or set.
     * @param {any} [value] - The value to set for the attribute.
     * @returns {Attributes[K] | null | undefined} The value of the attribute or null if not found, or undefined if setting.
     */
    attrSync<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Attributes[K] | null | undefined {

        if (value === undefined) {
            return this.getAttributeSync(key) as Attributes[K] ?? null;
        }

        this.setAttribute(key, value).then(() => {});

        return undefined;
    }

    /**
     * Sets the value of a specific attribute in the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to set.
     * @param {any} value - The value to set for the attribute.
     * @throws {Error} If the attribute is not in the allowed fields or if a date field is set with a non-Date value.
     */
    async setAttribute<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Promise<void> {
        if (this.attributes === null) {
            this.attributes = {} as Attributes;
        }
        if (this.attributes) {
            this.attributes[key] = value as Attributes[K];
        }

        // Broadcast the event 
        // Observer will receive the event
        this.broadcast(
            new OnAttributeChangeBroadcastEvent({ key: key as string, value, attributes: this.attributes })
        )
    }
    
    /**
     * Retrieves the value of a specific attribute from the model's data.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Attributes[K] | null} The value of the attribute or null if not found.
     */
    getAttributeSync<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null {
        return this.attributes?.[key] ?? null;
    }

    /**
     * Retrieves the value of a specific attribute from the model's data, or
     * fetches the relationship data if the attribute is a relationship.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Attributes[K] | null} The value of the attribute or null if not found.
     */
    async getAttribute<K extends keyof Attributes = keyof Attributes>(key: K): Promise<Attributes[K] | null> {

        const relationsip = EloquentRelationship.getRelationshipInterface(this, key as string);

        if(relationsip) {
            return this.getAttributeRelationship(key, relationsip);
        }

        return this.getAttributeSync(key);
    }

    /**
     * Retrieves the value of a specific attribute from the model's data, or
     * fetches the relationship data if the attribute is a relationship.
     * 
     * @template K Type of the attribute key.
     * @param {K} key - The key of the attribute to retrieve.
     * @returns {Attributes[K] | null} The value of the attribute or null if not found.
     */
    protected async getAttributeRelationship<K extends keyof Attributes = keyof Attributes>(key: K, relationship?: IRelationship): Promise<Attributes[K] | null> {

        if(this.attributes?.[key]) {
            return this.attributes[key] 
        }

        if(!relationship) {
            relationship = EloquentRelationship.fromModel(this.constructor as ICtor<IModel>, key as string);
        }

        this.setAttribute(key, await EloquentRelationship.fetchRelationshipData<Attributes, K>(this, relationship));

        return this.getAttributeSync(key);
    }

    /**
     * Retrieves the entire model's data as an object.
     * 
     * @returns {IModelAttributes | null} The model's data as an object, or null if no data is set.
     */
    getAttributes(): Attributes | null {
        return this.attributes;
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
     * Retrieves the fields defined on the model.
     * The fields are the list of fields that are allowed to be set on the model.
     * This is used for mass assignment.
     * @returns The list of fields defined on the model.
     */
    getFields(): string[] {
        let fields = this.fields

        if(!this.fields.includes(this.primaryKey)) {
            fields = [this.primaryKey, ...fields]
        }

        return fields
    }

    /**
     * Retrieves the table name associated with the model.
     * The table name is determined by the value of the `table` property.
     * If the `table` property is not set, this method will throw a MissingTableException.
     * @returns The table name associated with the model.
     * @throws MissingTableException If the table name is not set.
     */
    useTableName(): string {
        if(!this.table || this.table?.length === 0) {
            return this.getDefaultTable()
        }
        return this.table
    }
    
    /**
     * Retrieves the table name associated with the model.
     * The table name is pluralized and lowercased.
     * @param tableName - The name of the table to retrieve.
     * @returns The pluralized and lowercased table name.
     */
    public static formatTableName(tableName: string): string {
        return Str.plural(Str.snakeCase(tableName)).toLowerCase()
    }
    

    /**
     * Retrieves the connection name associated with the model.
     * This is achieved by instantiating the model and accessing its connection property.
     *
     * @returns {string} The connection name of the model.
     */
    public static getConnectionName(): string {
        return new (this as unknown as ICtor<IModel>)(null).connection;
    }

    /**
     * Retrieves the primary key associated with the model.
     * This is achieved by instantiating the model and accessing its primaryKey property.
     *
     * @returns {string} The primary key associated with the model.
     */
    public static getPrimaryKey(): string {
        return new (this as unknown as ICtor<IModel>)(null).primaryKey;
    }

    /**
     * Retrieves a query builder instance for the model.
     * The query builder is a fluent interface for querying the database associated with the model.
     * @returns {IEloquent<IModel>} The query builder instance.
     */
    private queryBuilder(): IEloquent<IModel> {
        return app('query').builder(this.constructor as ICtor<IModel>);
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
     * @param {GetAttributesOptions} [options={ excludeGuarded: true }] - Options for data retrieval.
     * @returns {Attributes | null} The model's data, potentially excluding guarded fields.
     * @deprecated use `toObject` instead
     */
    async getData(options: GetAttributesOptions = { excludeGuarded: true }): Promise<Attributes | null> {
        let data = this.getAttributes();

        if (data && options.excludeGuarded) {
            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => !this.guarded.includes(key))
            ) as Attributes;
        }

        return data as Attributes;
    }

    
    async toObject(): Promise<Attributes | null> {
        return this.getData({ excludeGuarded: false });
    }

    /**
     * Refreshes the model's data from the database.
     * 
     * @returns {Promise<Attributes | null>} The refreshed data or null if the model has no ID.
     */
    async refresh(): Promise<Attributes | null> {
        const id = this.getId();

        if (!id) return null;

        const result =  await this.queryBuilder().find(id)
        const attributes = result ? await result.toObject() : null;

        this.attributes = attributes ? { ...attributes } as Attributes : null
        this.original = { ...(this.attributes ?? {}) } as Attributes

        return this.attributes as Attributes;
    }

    /**
     * Updates the model in the database.
     * 
     * @returns {Promise<void>}
     */
    async update(): Promise<void> {
        if (!this.getId() || !this.attributes) return;

        await this.queryBuilder().where(this.primaryKey, this.getId()).update(this.attributes);
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

            this.attributes = await (await this.queryBuilder().insert(this.attributes)).first()?.toObject() as Attributes;
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
        await this.queryBuilder().where(this.primaryKey, this.getId()).delete();
        this.attributes = null;
        this.original = null;
        await this.observeData('deleted', this.attributes);
    }

    /**
     * Retrieves a related model based on a "belongs to" relationship.
     * 
     * @template ForiegnModel The type of the related model.
     * @param {ICtor<ForiegnModel>} foreignModel - The constructor of the related model.
     * @param {Omit<IBelongsToOptionsLegacy, 'foreignTable'>} options - Options for the relationship.
     * @returns {BelongsTo} An instance of the BelongsTo class for chaining.
     */
    belongsTo<ForiegnModel extends IModel = IModel>(foreignModel: ModelConstructor<ForiegnModel>, options: Omit<IBelongsToOptions, 'foreignTable'>): BelongsTo {
        return new BelongsTo(this.constructor as ModelConstructor<IModel>, foreignModel, options);
    }

    /**
     * Retrieves a related model based on a "has many" relationship.
     * 
     * @template ForiegnModel The type of the related model.
     * @param {ICtor<ForiegnModel>} foreignModel - The constructor of the related model.
     * @param {Omit<IHasManyOptions, 'foreignTable'>} options - Options for the relationship.
     * @returns {HasMany} An instance of the HasMany class for chaining.
     */
    hasMany<ForiegnModel extends IModel = IModel>(foreignModel: ModelConstructor<ForiegnModel>, options: Omit<IHasManyOptions, 'foreignTable'>): HasMany {
        return new HasMany(this.constructor as ModelConstructor<IModel>, foreignModel, options);
    }

}