const express = require("express");

const app = express();

// Static Files
app.use(express.static("./public"));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
})

const PORT = process.env.PORT || 3000;

let server = app.listen(PORT, () => console.log("Server is running on port " + PORT));