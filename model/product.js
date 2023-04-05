import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    weight: String,
    quantity: Number,
    rating: Number,
    color: String,
  },
  {
    toJSON: {
      transform: function (doc, obj) {
        delete obj.__v;
        return obj;
      },
    },
  }
);
ProductSchema.index({ rating: 1 });

export const ProductModel = mongoose.model("Product", ProductSchema);
