const express = require("express");
const mongoose = require("mongoose");
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
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders:
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
  credentials: true,
  maxAge: 7200,
};

require("dotenv").config();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
// Set middleware of CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight handling

//Images
app.use(express.static("images"));

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
