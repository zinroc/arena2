var express = require("express"),
    bodyParser = require("body-parser"),
    database_setup = require("./database_setup.js"),
    timer = require("./timer.js"),
    player = require("./player.js"),
    gameState = require("./gameState.js"),
    characters = require("./characters.js");



var app = express();
app.use(bodyParser.json());
app.set("port", process.env.PORT || 8000);

app.use(express.static("public"));

database_setup.createTables().then(function () {
    timer.Timer();
});

/********************** Views *************************************/
var showLoginScreen = function (req, res) {
    res.sendFile(__dirname + "/views/login.html");
};

app.get("/", showLoginScreen);
app.get("/login", showLoginScreen);

app.get("/game", function (req, res) {
    res.sendFile(__dirname + "/views/arena.html");
});
/********************** Views *************************************/

/********************** Players *************************************/
app.post("/api/players/get", function (req, res) {
    if (req.body.email && req.body.name) {
        player.get(req.body.email, req.body.name, res);
    } else {
        res.status(400).send("Email and name are required");
    }
});

app.post("/api/players/buyScrollPack", function (req, res){
    if (req.body.email){
        player.buyScrollPack(req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/players/getScrollPacks", function (req, res) {
    if (req.query.email){
        player.getScrollPacks(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

/********************** Players *************************************/
/********************** Game State *************************************/

app.post("/api/gameState/advanceTimestep", function (req, res) {
    if (req.body.email) {
        gameState.advanceTimestep(req.body.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.get("/api/gameState/get", function (req, res) {
    if (req.query.email) {
        gameState.get(req.query.email, res);
    } else {
        res.status(400).send("Email is required");
    }
});

/********************** Game State *************************************/
/********************** Characters *************************************/

app.get("/api/characters/getVisitors", function (req, res){
    if (req.query.email){
        characters.getVisitors(req.query.email, res);
    } else {
        res.status(400).send("Email is required");  
    }
});

app.get("/api/characters/get", function (req, res) {
    if(req.query.email){
        characters.get(req.query.email, res);
    } else {
        res.status(400).send("Email is required");  
    }
});

/********************** Characters *************************************/
/********************* API v2 *************************/


app.listen(app.get("port"), function () {
    console.log("Server running on port " + app.get("port"));
});
