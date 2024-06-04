import { IModel } from "../../../interfaces/IModel";
import BaseModel from "../../../models/BaseModel";
import { FleaListingItem } from "../types/types.t";


export default class FleaListingItemModel extends BaseModel implements IModel {
    collection = "fleaListingItems";
    
    constructor(data: FleaListingItem | null) {
        super(data);    
    }   
    
} 