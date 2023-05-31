const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express(3000);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/todoList", { useNewUrlParser: true });

let count = 1;

const shema = new mongoose.Schema({
    number: Number,
    item: String,
    isCompleted: Boolean,
    date:String
});

const Todo = mongoose.model("Todo", shema);

function addItem(count, itemName) {
    const today = new Date();
    const day = today.toLocaleDateString();
    const item = new Todo({
        number: count,
        item: itemName,
        isCompleted: false,
        date:day

    })
    item.save();
}
app.post("/complete", function (req, res) {
    console.log(req.body.isCheck);

    itemID = req.body.isCheck;
    Todo.findByIdAndUpdate(itemID, { isCompleted: true }).then(
        function (err, docs) {
            if (err) {
                console.log(err)
            }

        });
    res.redirect("/");

});
app.post("/delete", function (req, res) {
    itemID = req.body.delete;
    Todo.findByIdAndDelete(itemID).then(
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });
    res.redirect("/");

});

app.post("/edit", function (req, res) {
    itemID = req.body.edit;
    // Todo.findByIdAndUpdate(itemID).then(
    //     function (err, docs) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         else {
    //             console.log("Updated User : ", docs);
    //         }
    //     });

});

app.post("/", function (req, res) {
    var item = req.body.item;
    if (req.body.list === "Work") {
        getCompletedItems();

        res.redirect("/work");
    } else {
        addItem(count, item);
        count++;
        res.redirect("/");
    }

});

app.get("/", function (req, res) {

    Todo.find({}).then(function (foundItems) {
        res.render('list', { listTitle: "Todo List", newItems: foundItems });
    })


});

app.get("/complete", function (req, res) {

    Todo.find({ isCompleted: true}).then(function (foundItems) {

            res.render("list", { listTitle: "Complete List",newItems: foundItems })
        
    });
    
    
});

app.listen(3000, function () {
    console.log("server is running");

});



