import mongoose from "mongoose";
// import mongoosePaginate from 'mongoose-paginate-v2';
const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products', // Suponiendo que el modelo de productos se llama 'products'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // Puedes establecer la cantidad por defecto en 1 si lo deseas
    }
  }],
});
// cartSchema.plugin(mongoosePaginate)


export const cartModel = mongoose.model("cart",cartSchema);