const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');
const projectRoutes = require("./routes/Projects");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use("/projects", projectRoutes);
connectDB();

app.get("/", (req, res) => {
    res.send({message:"Backend is running!"});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
