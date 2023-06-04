const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const cors = require("cors");

const app = express()
app.use(express.json());
app.use(cors());
config();


// CONNECT DATABASE
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE)
    .then(() => console.log("MongoDB is connected"))
    .catch(() => console.log("MongoDB is not connected"));

app.get("/", async (req, res) => {
    res.json("Team work")
})



const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`${PORT} is listened`))
