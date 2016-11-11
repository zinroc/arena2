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

app.get("/encounter", function (req, res){
    res.sendFile(__dirname + "/views/encounter.html")
});



/********************** Views *************************************/

/********************** Encounter *************************************/

/********************** Encounter *************************************/


/********************** Players *************************************/
app.post("/api/players/get", function (req, res) {
    if (req.body.email && req.body.name) {
        player.get(req.body.email, req.body.name, res);
    } else {
        res.status(400).send("Email and name are required");
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

app.post("/api/gameState/dropTables", function (req, res) {
    if (req.body.email) {
        gameState.dropTables(req.body.email, res);
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

app.get("/api/characters/get", function (req, res) {
    if(req.query.email){
        characters.get(req.query.email, res);
    } else {
        res.status(400).send("Email is required");  
    }
});

app.get("/api/characters/getPlayerCharacters", function (req, res) {
    console.log(req.query.email);
    if(req.query.email){
        characters.getPlayerCharacters(req.query.email, res);
    } else {
        res.status(400).send("Email is required");  
    }
});

app.get("/api/characters/elders", function (req, res) {
    console.log(req.query.email);
    if(req.query.email){
        characters.elders(req.query.region, res);
    } else {
        res.status(400).send("Email is required");  
    }
});

app.post("/api/characters/createPlayerCharacter", function (req, res) {
    if (req.body.email) {
        characters.createPlayerCharacter(req.body.email, req.body.name, req.body.family_name, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/characters/deletePlayerCharacter", function (req, res) {
    if (req.body.email) {
        characters.deletePlayerCharacter(req.body.email, req.body.id, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/characters/spawnPlayerCharacter", function (req, res) {
    if (req.body.email) {
        characters.spawnPlayerCharacter(req.body.email, req.body.id, req.body.location, res);
    } else {
        res.status(400).send("Email is required");
    }
});

app.post("/api/characters/travel", function (req, res) {
    if (req.body.email) {
        characters.travel(req.body.email, req.body.id, req.body.destination, req.body.direction, res);
    } else {
        res.status(400).send("Email is required");
    }
});
/**
app.post("/api/characters/encounter", function (req, res){
    if (req.body.email){
        characters.encounter(req.body.email, req.body.id, req.body.elder, req.body.encounter_namr res);
    } else {
        res.status(400).send("Email is required");
    }
});
**/




/********************** Characters *************************************/
/********************* API v2 *************************/


app.listen(app.get("port"), function () {
    console.log("Server running on port " + app.get("port"));
});
