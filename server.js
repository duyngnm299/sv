const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");

dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/post", postRoutes);

const PORT = process.env.PORT || 5000;
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/user";

mongoose
  .connect(MONGOOSE_URL, { useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
