import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const prodcutSchema = new mongoose.Schema({
    id:Number,
    title:String,
    description:String,
    code:String,
    price:Number,
    status:Boolean,
    category:String,
    thumbnail:Array,
    carts:{
        type:Array,
        default:[]
    }
})
prodcutSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model("products",prodcutSchema);