const express = require("express");
const todoController = require("./controllers/todoController.js");

const app = express();

//server static files
app.use(express.static("public"));

//fire controllers
todoController(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running on port " + PORT));
