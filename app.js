const express = require("express");

const app = express();

// Static Files
app.use(express.static("./public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

const PORT = env.process.PORT || 3000;

let server = app.listen(PORT, () => console.log("Server is running on port " + PORT));