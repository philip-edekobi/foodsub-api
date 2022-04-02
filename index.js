const express = require('express');
const cors = require('cors');
const routes = require("./routes.js");
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    preflightContinue: true,
    origin: "*"
}));

app.use(express.json());

app.use("/api/", routes);

require("dotenv").config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(res => app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`)))
    .catch(err => console.log(err));