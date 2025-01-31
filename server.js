console.log("Hello World!!");

//levantamos el server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const UserRouter = require("./routes/UserRouter");
const LoggingRouter = require("./routes/LoggingRouter");
const ReservationsRouter = require("./routes/ReservationsRouter");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser())

app.use("/api", UserRouter);
app.use("/api", LoggingRouter);
app.use("/api", ReservationsRouter);

//Conect to DB
const URL = process.env.MONGO_URL;
mongoose
  .connect(URL, {})
  .then(() => {
    console.log("DB is now connected");
  })
  .catch((error) => {
    console.log(error);
  });

//declaramos los usos para el server

app.listen(3500, () => {
  console.log("Server running on port 3500");
});
