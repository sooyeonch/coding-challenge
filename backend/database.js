const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

let cheeseDB;
let openedDB;

// To open the database in the beginning, and use the useDatabase() function to access the database
function openDatabase() {
    MongoClient.connect(url, (error, database) => {
        if (error) {
            throw error;
        }
        openedDB = database;
        cheeseDB = database.db("cheeseDB");
    });
} // end of openDatabase()

// Return the connected database
function useDatabase() {
    return cheeseDB;
} // end of useDatabase()

// Delete the collection and close the database
async function closeDatabase() {
    await cheeseDB.collection("cheeseDirectory").drop((error) => {
        if (error) {
            throw error;
        }
        openedDB.close();
    });
} // end of closeDatabase()

module.exports = {
    openDatabase,
    useDatabase,
    closeDatabase
}; // end of module.exports