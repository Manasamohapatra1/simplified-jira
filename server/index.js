const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/auth', authRoutes);

connectDB();

app.get("/", (req, res) => {
    res.send({message:"Backend is running!"});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
