const express = require("express");
const bodyParser = require("body-parser");

const server = new express();
server.use(bodyParser.json());

const SERVER_PORT = 5000;

const mysql = require("mysql");

const connString = {

    host: "localhost",
    user: "root",
    password: "123456789",
    database: "companydb"
}

const dbConnection = mysql.createConnection(connString);

dbConnection.connect((err) => {
    console.log("connection");
})

server.get("/", (req, res) => {

    dbConnection.query("SELECT * FROM employee", (err, result) => {

        res.json(result);
        res.end();
    });
});



const startupCallback = function () {

    console.log(`Server started at: http://localhost:${service.address().port}`);
};

const service = server.listen(SERVER_PORT, startupCallback);