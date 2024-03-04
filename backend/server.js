const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const likeRoutes = require("./routes/likeRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

const app = express();

require("dotenv").config();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/like", likeRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING!");
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
