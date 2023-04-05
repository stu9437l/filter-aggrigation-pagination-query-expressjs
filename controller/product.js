import mongoose from "mongoose";
import { ProductModel } from "../model/product.js";
import casual from "casual";

export const CreateProduct = async (req, res, next) => {
  try {
    const { name, price, category, weight, quantity, color, rating } = req.body;
    const repeatedProduct = await ProductModel.findOne({ name });
    if (repeatedProduct) {
      return res.status(404).send(`${name} is already in list`);
    }
    const product = new ProductModel({
      name,
      price,
      category,
      weight,
      quantity,
      color,
      rating,
    });
    const newProduct = await product.save();
    return res.status(200).json({
      message: "product created",
      newProduct,
    });
  } catch (err) {
    next(new Error("failed"));
  }
};

export const GetAllProducts = async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const products = await ProductModel.aggregate([
        { $group: { _id: `$color`, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      if (!products) {
        return res.status(404).send("No Product found");
      }
      return res.status(200).json({
        count: products.length,
        products,
      });
    } else {
      const { category, price, rating, color } = req.query;
      const selectedCategory = await ProductModel.find({
        rating: { $lt: rating },
      });
      if (selectedCategory.length < 1) {
        return res.status(404).send("No product found");
      }
      return res.status(200).json({
        count: selectedCategory.length,
        selectedCategory,
      });
    }
  } catch (err) {
    next(new Error(err));
  }
};

export const GetByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("ID is not valid");
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).send("No Product found");
    }
    return res.status(200).json(product);
  } catch (err) {
    next(new Error(err));
  }
};

export const Pagination = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const pageNumbers = req.query.pageNumbers || 5;
    const skipNumbers = (page - 1) * 10;
    const selectedCategory = await ProductModel.find({}).skip(skipNumbers);
    if (!selectedCategory) {
      return res.status(404).send("No product found");
    }
    return res.status(200).json({
      count: selectedCategory.length,
      selectedCategory,
    });
  } catch (err) {
    next(new Error(err));
  }
};

export const EntryData = async (req, res, next) => {
  const products = Array.from({ length: 100 }, () => {
    return new ProductModel({
      name: casual.title,
      price: casual.integer(10, 1000),
      rating: casual.integer(1, 5),
      quantity: casual.integer(1, 100),
      category: casual.word,
      weight: casual.double(1, 10) + "kg",
      color: casual.color_name,
    });
  });
  const newProducts = await ProductModel.insertMany(products);
  res.status(200).json({
    count: newProducts.length,
    newProducts,
  });
};
