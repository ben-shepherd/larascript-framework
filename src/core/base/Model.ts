import { Db, ObjectId } from 'mongodb';


import BelongsTo from '../domains/database/mongodb/relationships/BelongsTo';
import HasMany from '../domains/database/mongodb/relationships/HasMany';
import HasOne from '../domains/database/mongodb/relationships/HasOne';
import IData from '../interfaces/IData';
import { Dates, GetDataOptions, IModel, ModelConstructor } from '../interfaces/IModel';
import { IObserver } from '../interfaces/observer/IObserver';
import { WithObserver } from '../observer/WithObserver';
import { App } from '../services/App';

export interface BaseModelData {
    _id?: ObjectId
    createdAt?: Date,
    updatedAt?: Date,
    [key: string]: any
}

export default abstract class Model<Data extends BaseModelData> extends WithObserver<Data> implements IModel {
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
    }

    protected getDb(): Db {
        return App.container('mongodb').getDb(this.connection);
    }

    /**
     * Returns the ObjectId associated with the primary key of the Model instance, or undefined if the primary key is not set.
     *
     * @return {ObjectId | undefined} The ObjectId associated with the primary key, or undefined if the primary key is not set.
     */
    getId(): ObjectId | undefined {
        if(!(this.data?._id instanceof ObjectId)) {
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
        if(!this.fields.includes(key as string)) {
            throw new Error(`Attribute ${key as string} not found in model ${this.collection}`);
        }
        if(this.dates.includes(key as string) && value instanceof Date === false) {
            throw new Error(`Attribute '${key as string}' is a date and can be only set with the Date not found in model ${this.collection}`);
        }
        if(this.data) {
            this.data[key] = value;
        }

        /**
         * Observe properties changed with custom methods
         */
        if(Object.keys(this.observeProperties).includes(key as string)) {
            this.data = this.observeDataCustom(this.observeProperties[key as string] as keyof IObserver<any>, this.data)
        }
    }

    /**
     * Retrieves the data from the model.
     *
     * @param {GetDataOptions} options - The options for retrieving the data.
     * @return {Data | null} The retrieved data or null if no data is available.
     */
    getData(options: GetDataOptions): Data | null {
        let data = this.data;

        if(options.excludeGuarded) {
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
        if(!this.data) return null;

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
        if(!this.getId()) return;

        await this.getDb()
            .collection(this.collection)
            .updateOne({ [this.primaryKey]: this.getId() }, { $set: this.data as IData });
    }
    
    /**
     * Saves the model's data to the MongoDB collection. If the model has no ID, it inserts the data and refreshes the model.
     * If the model has an ID, it updates the existing document with the new data and refreshes the model.
     *
     * @return {Promise<void>} A promise that resolves when the save operation is complete.
     */
    async save(): Promise<void> {
        
        if(this.data && !this.getId()) {
            
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
        if(!this.data) return;
        this.data = this.observeData('deleting', this.data)
        await this.getDb().collection(this.collection).deleteOne({ [this.primaryKey]: this.getId() })
        this.data = null
        this.observeData('deleting', this.data)
    }

    /**
     * Asynchronously retrieves a related model instance based on the provided local model, local key, foreign model constructor, and foreign key.
     *
     * @param {LocalModel} model - The local model instance.
     * @param {keyof LocalData} localKey - The key of the local model's attribute used to establish the relationship.
     * @param {new (...any: any[]) => ForeignModel} foreignModelCtor - The constructor function for the foreign model.
     * @param {keyof ForeignData} foreignKey - The key of the foreign model's attribute used to establish the relationship.
     * @param {object} foreignKey - Optional filter
     * @return {Promise<ForeignModel | null>} A Promise that resolves to the related foreign model instance, or null if no related model is found.
     */
    async belongsTo<
        LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: ModelConstructor<ForeignModel>,
        foreignKey: keyof ForeignData,
        filters: object = {}
    ): Promise<ForeignModel | null> 
    {
        const data = await new BelongsTo<LocalData, LocalModel, ForeignData>().handle(
            model,
            new foreignModelCtor().collection,
            foreignKey,
            localKey,
            filters
        )
        
        if(!data) return null

        return new foreignModelCtor(data)
    }

    /**
     * Asynchronously retrieves an array of related model instances based on the provided local model, local key, foreign model constructor, and foreign key.
     *
     * @param {LocalModel} model - The local model instance.
     * @param {keyof LocalData} localKey - The key of the local model's attribute used to establish the relationship.
     * @param {new (...any: any[]) => ForeignModel} foreignModelCtor - The constructor function for the foreign model.
     * @param {keyof ForeignData} foreignKey - The key of the foreign model's attribute used to establish the relationship.
     * @param {object} foreignKey - Optional filter
     * @return {Promise<ForeignModel | null>} A Promise that resolves to the related foreign model instance, or null if no related model is found.
     */
    async hasMany<
        LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: ModelConstructor<ForeignModel>,
        foreignKey: keyof ForeignData,
        filters: object = {}
    ): Promise<ForeignModel[]> 
    {
        const results = await new HasMany<LocalData, LocalModel, ForeignData>().handle(
            model,
            new foreignModelCtor().collection,
            foreignKey,
            localKey,
            filters
        )

        if(!results) return []

        return results.map((result) => new foreignModelCtor(result))
    }

    /**
     * Asynchronously retrieves a related model instance based on the provided local model, local key, foreign model constructor, and foreign key.
     *
     * @param {LocalModel} model - The local model instance.
     * @param {keyof LocalData} localKey - The key of the local model's attribute used to establish the relationship.
     * @param {new (...any: any[]) => ForeignModel} foreignModelCtor - The constructor function for the foreign model.
     * @param {keyof ForeignData} foreignKey - The key of the foreign model's attribute used to establish the relationship.
     * @param {object} foreignKey - Optional filter
     * @return {Promise<ForeignModel | null>} A Promise that resolves to the related foreign model instance, or null if no related model is found.
     */
    async hasOne<
        LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: ModelConstructor<ForeignModel>,
        foreignKey: keyof ForeignData,
        filters: object = {}
    ): Promise<ForeignModel | null> 
    {
        const document = await new HasOne<LocalData, LocalModel, ForeignData>().handle(
            model,
            new foreignModelCtor().collection,
            foreignKey,
            localKey,
            filters
        )

        if(!document) return null

        return new foreignModelCtor(document)
    }

    /**
     * Set a timestamp on a Date field
     * @param dateTimeField 
     * @param value 
     * @returns 
     */
    protected setTimestamp(dateTimeField: string, value: Date = new Date()) {
        if(!this.timestamps || !this.dates.includes(dateTimeField)) {
            return;
        }
        this.setAttribute(dateTimeField, value)
    }
} 
