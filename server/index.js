const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
require("dotenv").config();
const invoiceRoute = require("./router/invoice");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Mongo connected");
});

app.use("/hello", (req, res) => {
  res.send("Hello");
});

app.use("/api", invoiceRoute);

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
