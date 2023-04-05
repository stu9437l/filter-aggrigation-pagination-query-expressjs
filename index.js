const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const faker = require("faker");
const { default: mongoose } = require("mongoose");
const app = express();

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

const ProductModel = mongoose.model("Product", ProductSchema);

const DB = process.env.LOCAL_DB;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

// parse the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/faker-data", async (req, res, next) => {
  const products = [];
  for (const i = 0; i < 100; i++) {
    const product = new ProductModel({
      name: faker.commerce.product(),
      price: faker.commerce.productPrice(),
      category: faker.commerce.productCategory(),
      weight: faker.wight.inKilogram(),
      quantity: faker.number.productQuantity(),
      rating: faker.user.productRating(),
      color: faker.color.productColor(),
    });
    products.push(product);
  }
  const newProducts = await ProductModel.insertMany(products);
  res.status(200).json({
    count: newProducts.length,
    newProducts,
  });
});

//server listning
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port :" + PORT);
});
