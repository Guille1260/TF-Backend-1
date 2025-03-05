import mongoose from "mongoose";

const prodcutSchema = new mongoose.Schema({
    id:Number,
    title:String,
    description:String,
    code:String,
    price:Number,
    status:Boolean,
    category:String,
    thumbnail:Array,
})

export const productModel = mongoose.model("products",prodcutSchema);