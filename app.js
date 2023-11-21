const express = require("express");
const bodyParser = require("body-parser");

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use("/public",express.static("public"));


const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/WordGameDB", { useNewUrlParser: true });
    console.log(`successfully connected: ${conn.connection.host} at DB: ${conn.connection.name}`);
};
connectDB().catch((err) => {
    console.log(`Error : ${err}`);
});

const ItemSchema = {
    userName: String,
    userScore: String,
};
const Item = mongoose.model("details", ItemSchema);


app.get("/", function (req, res) {
    res.render("username");
})

app.get("/score", function (req, res) {
    res.render("score");
})

app.get("/findscore", function (req, res) {
    let Username = req.body.Username;
    let Userscore;
    let founded = false;
    Item.find({})
        .then(foundItem => {
            foundItem.forEach(function (obj) {
                if (obj.userName === Username) {
                    Userscore = obj.userScore;
                    founded = true;
                }
            })
            if (!founded) {
                res.render("findscore", { foundscore: "Invalid User" })
            } else {
                res.render("findscore", { foundscore: Userscore });
            }
        })
})

app.get("/game", function (req, res) {
    res.render("game");
})





var currentUser;
var currentUserScore;

app.post("/", function (req, res) {
    let username = req.body.username;
    currentUser = username;
    let currItem = new Item({
        userName: username,
        userScore: "0",
    })
    let present = false;
    Item.find({})
        .then(foundItem => {
            foundItem.forEach(function (obj) {
                if (obj.userName == username) {
                    present = true;
                }
            })
            if (!present) {
                Item.insertMany(currItem);
            }
            res.render("game");
        })
})


app.post("/game", bodyParser.urlencoded(), function (req, res) {
    let currentUserScore = req.body.winScore;

    Item.find({})
        .then(foundItem => {
            foundItem.forEach(function (obj) {
                if (currentUser === obj.userName) {
                    if (parseInt(obj.userScore) < parseInt(currentUserScore)) {
                        const updateINfo = async () => {
                            await Item.updateOne({userName:currentUser},{$set:{userScore:currentUserScore}});
                        }
                        updateINfo();
                    }
                }
            })
        })
    res.render("score", {
        username: currentUser,
        userscore: currentUserScore,
    })
})



app.post("/findscore", function (req, res) {
    let Username = req.body.username;
    let Userscore;
    let founded = false;
    Item.find({})
        .then(foundItem => {
            foundItem.forEach(function (obj) {
                if (obj.username == Username) {
                    Userscore = obj.userScore;
                    founded = true;
                }
            })
            if (!founded) {
                res.render("findscore", { foundscore: "Invalid User" })
            } else {
                res.render("findscore", { foundscore: Userscore });
            }
        })
})







app.listen(3000, function () {
    console.log("Server started on port 3000 localhost");
});