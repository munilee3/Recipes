const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");
const cors = require("cors");

const PORT = 4000;
const app = express();

app.use(cors({
    origin: "https://recipes-frontend-8xvd.onrender.com",
    methods: ['GET', 'POST'],
}));

mongoose.connect("mongodb+srv://muniswamykanike:munilee3@data.drnbasx.mongodb.net/?retryWrites=true&w=majority&appName=data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {console.log("MongoDB connected successfully")})
.catch((err) => {console.error("MongoDB connection error:", err)});

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/api/recipes", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const total = await Recipe.countDocuments();
  const data = await Recipe.find()
    .sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ page, limit, total, data });
});

app.get("/api/recipes/search", async (req, res) => {
  const { calories, title, cuisine, total_time, rating } = req.query;
  const filter = {};

  if (title) filter.title = new RegExp(title, "i");
  if (cuisine) filter.cuisine = cuisine;

  if (rating) {
    const [op, val] = rating.match(/(>=|<=|=|>|<)(\d+(\.\d+)?)/).slice(1);
    filter.rating = { [opMap(op)]: Number(val) };
  }

  if (total_time) {
    const [op, val] = total_time.match(/(>=|<=|=|>|<)(\d+)/).slice(1);
    filter.total_time = { [opMap(op)]: Number(val) };
  }

  if (calories) {
    const [op, val] = calories.match(/(>=|<=|=|>|<)(\d+)/).slice(1);
    filter["nutrients.calories"] = new RegExp(`^${val}`);
  }

  const data = await Recipe.find(filter);
  res.json({ data });
});

function opMap(op) {
  return {
    ">": "$gt",
    "<": "$lt",
    ">=": "$gte",
    "<=": "$lte",
    "=": "$eq",
  }[op];
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));