import { FilterQuery, Model, PopulateOptions, Types } from "mongoose";

interface FindOptions<TDocument> {
    filter?:FilterQuery<TDocument>;
    populate?:PopulateOptions[];
    select?:string;
    sort?:string;
    page?:number;
}
export abstract class DataBaseRepositoryService<TDocument> {
    constructor(private readonly model:Model<TDocument>){}
    async create(data:Partial<TDocument>):Promise<TDocument>{
        return this.model.create(data);
    }
    async findOne({filter = {},populate = []}:FindOptions<TDocument>):Promise<TDocument|null>{
        return this.model.findOne(filter).populate(populate);
    }
    async find({filter = {},populate = [],select = "",sort = "",page = 1}:FindOptions<TDocument>){
        const query =  this.model.find(filter)
        if (populate) {
            query.populate(populate);
        }
        if(select){
            query.select(select.replaceAll(","," "));
        }
        if(sort){
            query.sort(sort.replaceAll(","," "));
        }
        if(!page){
            return await query.exec();
        }
        const limit  = 2;
        const skip = (page - 1) * limit;
        return await query.skip(skip).limit(limit).exec();
        
    }
    async findOneAndUpdate(query:FilterQuery<TDocument>,data,options:{new?:boolean} = {new:false}):Promise<TDocument|null>{
        return this.model.findOneAndUpdate(query,data,options);
    }
    async findOneAndDelete(query:FilterQuery<TDocument>):Promise<TDocument|null>{
        return this.model.findOneAndDelete(query);
    }
    async findById(id:Types.ObjectId):Promise<TDocument|null>{
        return this.model.findById(id);
    }
    async deleteOne(query:FilterQuery<TDocument>){
        return this.model.deleteOne(query);
    }
    async deleteMany(query:FilterQuery<TDocument>){
        return this.model.deleteMany(query);
    }
}