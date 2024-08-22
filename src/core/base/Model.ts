import { Db, ObjectId } from 'mongodb';


import BelongsTo, { BelongsToOptions } from '@src/core/domains/database/mongodb/relationships/BelongsTo';
import HasMany, { HasManyOptions } from '@src/core/domains/database/mongodb/relationships/HasMany';
import { Dates, GetDataOptions, IModel } from '@src/core/interfaces/IModel';
import IModelData from '@src/core/interfaces/IModelData';
import { App } from '@src/core/services/App';
import Str from '@src/core/util/str/Str';
import { IObserver } from '../domains/observer/interfaces/IObserver';
import { WithObserver } from '../domains/observer/services/WithObserver';

export default abstract class Model<Data extends IModelData> extends WithObserver<Data> implements IModel<Data> {
    // The database connection
    public connection: string = 'default';

    // Primary identifier
    public primaryKey: string = '_id';

    // The MongoDB document
    public data: Data | null;

    // The MongoDB collection
    public collection!: string;

    // Describe the fields and guarded attributes of the model
    // Fields that are allowed to be set on the model
    public fields: string[] = [];

    // Fields that excluded when retrieving data when excludeGuarded is set to true
    public guarded: string[] = [];

    // Automatically update timestamps (createdAt, updatedAt)
    public dates: Dates = ['createdAt', 'updatedAt']
    public timestamps: boolean = true;

    // Observe proeprties with custom methods
    // Key: property name
    // Value: custom method
    public observeProperties: Record<string, string> = {};

    /**
     * Constructs a new instance of the Model class.
     *
     * @param {Data | null} data - The data to initialize the model with.
     */
    constructor(data: Data | null) {
        super()
        this.data = data;
        this.setDefaultCollection();
    }

    /**
     * Set default collection name
     * @returns 
     */
    protected setDefaultCollection()
    {
        if(this.collection) {
            return;
        }

        this.collection = Str.plural(Str.startLowerCase(this.constructor.name));
    }

    /**
     * Get database connection
     * @returns 
     */
    getDb(): Db {
        return App.container('mongodb').getDb(this.connection);
    }

    /**
     * Returns the ObjectId associated with the primary key of the Model instance, or undefined if the primary key is not set.
     *
     * @return {ObjectId | undefined} The ObjectId associated with the primary key, or undefined if the primary key is not set.
     */
    getId(): ObjectId | undefined {
        if (!(this.data?._id instanceof ObjectId)) {
            return undefined
        }
        return this.data?._id
    }

    /**
     * Returns the ObjectId associated with the primary key of the Model instance, or undefined if the primary key is not set.
     *
     * @return {ObjectId | undefined} The ObjectId associated with the primary key, or undefined if the primary key is not set.
     */
    getAttribute<K extends keyof Data = keyof Data>(key: K): Data[K] | null {
        return this.data?.[key] ?? null;
    }

    /**
     * Sets the value of a specific attribute in the model's data object.
     *
     * @param {K} key - The key of the attribute to set.
     * @param {any} value - The value to set for the attribute.
     * @throws {Error} If the attribute is not found in the model.
     * @return {void}
     */
    setAttribute<K extends keyof Data = keyof Data>(key: K, value: any): void {
        if (!this.fields.includes(key as string)) {
            throw new Error(`Attribute ${key as string} not found in model ${this.constructor.name}`);
        }
        if (this.dates.includes(key as string) && value instanceof Date === false) {
            throw new Error(`Attribute '${key as string}' is a date and can be only set with the Date not found in model ${this.collection}`);
        }
        if (this.data) {
            this.data[key] = value;
        }

        /**
         * Observe properties changed with custom methods
         */
        if (Object.keys(this.observeProperties).includes(key as string)) {
            this.data = this.observeDataCustom(this.observeProperties[key as string] as keyof IObserver<any>, this.data)
        }
    }

    /**
     * Set a timestamp on a Date field
     * @param dateTimeField 
     * @param value 
     * @returns 
     */
    setTimestamp(dateTimeField: string, value: Date = new Date()) {
        if (!this.timestamps || !this.dates.includes(dateTimeField)) {
            return;
        }
        this.setAttribute(dateTimeField, value)
    }

    /**
     * Fills the model with data.
     * @param data 
     */
    fill(data: Partial<Data>): void {
        Object.entries(data).filter(([_key, value]) => value !== undefined).forEach(([key, value]) => {
            this.setAttribute(key, value)
        });
    }

    /**
     * Retrieves the data from the model.
     *
     * @param {GetDataOptions} options - The options for retrieving the data.
     * @return {Data | null} The retrieved data or null if no data is available.
     */
    getData(options: GetDataOptions): Data | null {
        let data = this.data;

        if (options.excludeGuarded) {
            data = Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !this.guarded.includes(key))) as Data
        }

        return data;
    }

    /**
     * Refreshes the data of the model by querying the MongoDB collection.
     *
     * @return {Promise<Data | null>} The updated data of the model or null if no data is available.
     */
    async refresh(): Promise<Data | null> {
        if (!this.data) return null;

        this.data = await this.getDb().collection(this.collection)
            .findOne({ [this.primaryKey]: this.getId() }) as Data | null ?? null;

        return this.data
    }

    /**
     * Updates the document in the MongoDB collection with the provided data.
     *
     * @return {Promise<void>} A promise that resolves when the update is complete.
     * @throws {Error} If the document ID is not found.
     */
    async update(): Promise<void> {
        if (!this.getId()) return;

        await this.getDb()
            .collection(this.collection)
            .updateOne({ [this.primaryKey]: this.getId() }, { $set: this.data as IModelData });
    }

    /**
     * Saves the model's data to the MongoDB collection. If the model has no ID, it inserts the data and refreshes the model.
     * If the model has an ID, it updates the existing document with the new data and refreshes the model.
     *
     * @return {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        if (this.data && !this.getId()) {

            this.data = this.observeData('creating', this.data)
            this.setTimestamp('createdAt')
            this.setTimestamp('updatedAt')
            await this.getDb()
                .collection(this.collection)
                .insertOne(this.data);
            await this.refresh();

            this.data = this.observeData('created', this.data)
            return;
        }

        this.data = this.observeData('updating', this.data)
        this.setTimestamp('updatedAt')
        await this.update()
        await this.refresh()
        this.data = this.observeData('updated', this.data)
    }

    /**
     * Deletes the current model from the MongoDB collection.
     *
     * @return {Promise<void>} A promise that resolves when the deletion is complete.
     */
    async delete(): Promise<void> {
        if (!this.data) return;
        this.data = this.observeData('deleting', this.data)
        await this.getDb().collection(this.collection).deleteOne({ [this.primaryKey]: this.getId() })
        this.data = null
        this.observeData('deleting', this.data)
    }

    /**
     * Retrieves a related model instance based on the provided options.
     *
     * @param {BelongsToOptions} options - Options for the belongsTo relationship.
     * @return {Promise<ForeignModel | null>} A Promise that resolves to the related foreign model instance, or null if no related model is found.
     */
    async belongsTo<ForeignModel extends IModel = IModel>(options: BelongsToOptions): Promise<ForeignModel | null> {
        const data = await new BelongsTo().handle(options);

        if (!data) {
            return null
        }

        return new options['foreignModelCtor'](data) as ForeignModel
    }

    /**
     * Retrieves an array of related model instances based on the provided options.
     *
     * @param {HasManyOptions} options - Options for the hasMany relationship.
     * @return {Promise<ForeignModel[]>} A Promise that resolves to an array of related foreign model instances.
     */
    public async hasMany<ForeignModel extends IModel<any> = IModel<any>>(options: HasManyOptions): Promise<ForeignModel[]> {
        const data = await new HasMany().handle(options);

        if (!data) {
            return []
        }

        return data.map((d: any) => new options['foreignModelCtor'](d)) as ForeignModel[]
    }
} 
