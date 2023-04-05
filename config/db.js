import mongoose from "mongoose";

export const DBConnection = () => {
  // const DB = process.env.ATLAS_URI || process.env.LOCAL_DB;
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
};
