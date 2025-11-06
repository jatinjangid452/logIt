const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes.js");
const logEntryRoutes = require("./routes/logEntryRoutes");
const projectRoutes = require('./routes/projectsRoutes.js')
const taskRatingRoutes = require("./routes/taskRatingRoutes");
dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/logEntries", logEntryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ratings", taskRatingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));