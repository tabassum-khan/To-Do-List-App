const path = require("path");
const bodyParser = require("body-parser");

const filePath = path.join(__dirname , "../"); 

var active = [];
var completed = [];

module.exports = function(app){

    app.use(bodyParser.urlencoded( { extended: true }));

    app.get("/", function(req, res){
        res.sendFile(filePath + "index.html");
    });

    app.get("/api/get/todos", function(req, res){
        console.log("Entered /api/get/todos method. Displaying items...");
        res.json({active: active, completed: completed});
    });

    app.post("/api/add", function(req, res){
        console.log("Inside /api/add. Adding items..");

        active.push(req.body.item);
        console.log(active);

        res.json({active: active});
    });

    app.post("/api/edit", function(req, res){
        console.log("Inside /api/edit. Editing Items..");

        const prev_val = req.body.prev_val;
        const new_val = req.body.new_val;

        let index_active = active.indexOf(req.body.prev_val);
        active[index_active] = new_val;

        res.json({active: active});
    });

    app.delete("/api/remove", function(req, res){
        console.log("In /api/remove. Removing items..");

        const item_val = req.body.item_val;
        console.log(item_val);

        let index = active.indexOf(item_val);
        active.splice(index, 1); //remove 1 item at the specified index;

        completed.push(item_val);

        res.json({active: active, completed: completed});
    });

}