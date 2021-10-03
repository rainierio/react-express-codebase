const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();

/**
 * import routes
 */
const user = require("./routes/api/user");
const app = express();

/**
 * express app configurations
 */
app.use(express.static("client/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

/**
 * connect to database
 */
const connectDB = require("./config/db");
connectDB();

/**
 * API routes
 */
app.use("/api/userauth", user);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
