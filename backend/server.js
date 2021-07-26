const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./database.js");
const apiURL = "https://od-do.agr.gc.ca/canadianCheeseDirectory.json";
const process = require('process');

app.use(cors());

database.openDatabase(); // open the database

// Store data from the API in the database
fetch(apiURL)
    .then((response) => response.json())
    .then((object) => {
        let cheeseDB = database.useDatabase();
        cheeseDB.collection("cheeseDirectory").insertMany(object.CheeseDirectory, function (err) {
            if (err) throw err;
        });
    }); // end of fetch()

// Retrieve a specific cheese category
app.get('/category', (req, res) => {
    let categoryType = req.query.categoryType;
    let currentLanguage = req.query.currentLanguage;
    let data;
    let cheeseDB = database.useDatabase(); //use the database

    if (currentLanguage == "english") {
        data = cheeseDB.collection("cheeseDirectory").find({ "CategoryTypeEn": categoryType }).toArray();

    } else {
        data = cheeseDB.collection("cheeseDirectory").find({ "CategoryTypeFr": categoryType }).toArray();
    }
    data.then((dataToSend => res.json(dataToSend)));

}); // end of app.get()

// Start the server
app.listen(3000, () => {
    console.log("Server at port " + 3000 + " started!");
}); // end of app.listen()

// When Ctrl-C is pressed, delete the cheeseDirectory collection and close the database.
// And then finally terminated the server. 
process.on('SIGINT', async () => {
    await database.closeDatabase();
    console.log("\nCtrl-C: Terminating the backend & database  - Goodbye")
    process.exit();
}); // end of process.on()