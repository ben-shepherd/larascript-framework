import { IRepository } from "../../../interfaces/IRepository";
import BaseRepository from "../../../repositories/BaseRepository";
import FleaListingItemModel from "../model/FleaListingItemModel";
import { FleaListingItem } from "../types/types.t";

export default class FleaItemRepository extends BaseRepository<FleaListingItemModel> implements IRepository {

    constructor() {
        super('fleaListingItems', FleaListingItemModel)
    }
}