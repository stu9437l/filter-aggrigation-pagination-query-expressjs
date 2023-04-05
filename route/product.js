import express from "express";

import {
  CreateProduct,
  EntryData,
  GetAllProducts,
  GetByID,
  Pagination,
} from "../controller/product.js";
const router = express.Router();

router.post("/create", CreateProduct);
router.post("/faker", EntryData);

router.get("/", GetAllProducts);
router.get("/:id", GetByID);
// router.get("/", Pagination);

export default router;
