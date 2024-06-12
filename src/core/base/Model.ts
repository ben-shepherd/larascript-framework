import { Db, ObjectId } from 'mongodb';

import BelongsTo from '../domains/database/relationships/BelongsTo';
import HasMany from '../domains/database/relationships/HasMany';
import MongoDB from '../domains/database/services/MongoDB';
import IData from '../interfaces/IData';
import { GetDataOptions, IModel } from '../interfaces/IModel';

export interface BaseModelData {
    _id?: ObjectId
    createdAt?: Date,
    updatedAt?: Date,
    [key: string]: any
}

export default class Model<Data extends BaseModelData> implements IModel {
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

    /**
     * Constructs a new instance of the Model class.
     *
     * @param {Data | null} data - The data to initialize the model with.
     */
    constructor(data: Data | null) {
        this.data = data;
    }

    protected getDb(): Db {
        return MongoDB.getInstance().getDb(this.connection);
    }

    /**
     * Returns the ObjectId associated with the primary key of the Model instance, or undefined if the primary key is not set.
     *
     * @return {ObjectId | undefined} The ObjectId associated with the primary key, or undefined if the primary key is not set.
     */
    getId(): ObjectId | undefined {
        return this.getAttribute(this.primaryKey) ?? undefined
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
        if(this.data) {
            this.data[key] = value;
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
     * @return {Promise<IData | null>} The updated data of the model or null if no data is available.
     */
    async refresh(): Promise<IData | null> {
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
            await this.getDb()
                .collection(this.collection)
                .insertOne(this.data);
            await this.refresh();
            return;
        }

        await this.update()
        await this.refresh()
    }

    /**
     * Deletes the current model from the MongoDB collection.
     *
     * @return {Promise<void>} A promise that resolves when the deletion is complete.
     */
    async delete(): Promise<void> {
        if(!this.data) return;
        await this.getDb().collection(this.collection).deleteOne({ [this.primaryKey]: this.getId() })
        this.data = null
    }

        /**
     * Asynchronously retrieves a related model instance based on the provided local model, local key, foreign model constructor, and foreign key.
     *
     * @param {LocalModel} model - The local model instance.
     * @param {keyof LocalData} localKey - The key of the local model's attribute used to establish the relationship.
     * @param {new (...any: any[]) => ForeignModel} foreignModelCtor - The constructor function for the foreign model.
     * @param {keyof ForeignData} foreignKey - The key of the foreign model's attribute used to establish the relationship.
     * @return {Promise<ForeignModel | null>} A Promise that resolves to the related foreign model instance, or null if no related model is found.
     */
    async belongsTo<
        LocalData extends BaseModelData,
        LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData,
        ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: new (...any: any[]) => ForeignModel,
        foreignKey: keyof ForeignData,
    ): Promise<ForeignModel | null> 
    {
        const data = await new BelongsTo<LocalData, LocalModel, ForeignData>().handle(model, new foreignModelCtor().collection, foreignKey, localKey)
        
        if(!data) return null

        return new foreignModelCtor(data)
    }

    async hasMany<
        LocalData extends BaseModelData,
        LocalModel extends Model<LocalData>,
        ForeignData extends BaseModelData,
        ForeignModel extends Model<ForeignData>
    > (
        model: LocalModel,
        localKey: keyof LocalData,
        foreignModelCtor: new (...any: any[]) => ForeignModel,
        foreignKey: keyof ForeignData,
    ): Promise<ForeignModel[]> 
    {
        const results = await new HasMany<LocalData, LocalModel, ForeignData>().handle(model, new foreignModelCtor().collection, foreignKey, localKey)

        if(!results) return []

        return results.map((result) => new foreignModelCtor(result))
    }
} 
