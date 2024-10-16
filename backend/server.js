const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const likeRoutes = require("./routes/likeRoutes");
const searchRoutes = require("./routes/searchRoutes");
const followRoutes = require("./routes/followRoutes");
const commentRoutes = require("./routes/commentRoutes");
const emailRoutes = require("./routes/emailRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const privateMessageRoutes = require("./routes/privateMessageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const envVariables = require("./envVariables");
const app = express();

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
app.use("/api/search", searchRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/pms", privateMessageRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING! xd");
});

app.get("/api", (req, res) => {
  res.json("Provide further route after /api!");
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(envVariables.mongoUri)
  .then(() => {
    // listen for requests
    app.listen(envVariables.port, () => {
      console.log("connected to db & listening on port", envVariables.port);
    });
  })
  .catch((error) => {
    console.log(error);
  });
