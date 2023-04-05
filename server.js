import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { DBConnection } from "./config/db.js";
import { ErrorHandling } from "./middleware/errorHandling.js";
import bodyParser from "body-parser";
import router from "./route/index.js";

const app = express();

// DB connection
DBConnection();

// Error handling middlewaree
app.use(ErrorHandling);

// parse the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// route middleware
app.use("/api", router);

//server listning
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port :" + PORT);
});
