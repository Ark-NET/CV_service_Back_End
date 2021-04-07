const express = require("express");
const bodyParser = require("body-parser");
const connString = require('./service/connection');
const funcForDB = require("./CRUD")
const cors = require('cors')
const SERVER_PORT = 5000;
const mysql = require("mysql2");
const server = new express();
const md5 = require('md5');
const dbConnection = mysql.createConnection(connString.connString);


dbConnection.connect((err) => {

    console.log("Connected to MySQL");

});

server.use(bodyParser.json(), cors());



//IsUser By LoginPassword
server.post("/login", (req, respons) => {

    let log = req.body.login;
    let pass = md5(req.body.password);

    dbConnection.query(`SELECT * from users WHERE login = "${log}" and password = "${pass}"`,

        (err, result) => {

            if (result.length == 0) {

                respons.json({ "result": false });

            }
            else {
                respons.json({

                    "result": true, "id": result[0].id

                });
            }

            respons.end();

        });
});


//Get all users
server.get("/", (req, res) => {

    dbConnection.query("SELECT * FROM users", (err, result) => {

        res.json(result);

        res.end();

    });
});


//Get user by id
server.get("/:id", (req, res) => {

    let userById = {};

    userById.education = funcForDB.getEducation(req, dbConnection);

    userById.jobs = funcForDB.getJobs(req, dbConnection);

    userById.links = funcForDB.getLinks(req, dbConnection);

    dbConnection.query(`SELECT * FROM service_cv.users WHERE id=${req.params.id};`, (err, result) => {

        userById = result.find(element => element.id == req.params.id);

    });

    dbConnection.query(`SELECT * FROM service_cv.jobs WHERE user_id = ${req.params.id};`,
     (err, result) => {
        
        if (!result) userById.jobs = [];

        else userById.jobs = result;

    });

    dbConnection.query(`SELECT * FROM service_cv.links WHERE user_id = ${req.params.id};`,
     (err, result) => {
       
        if (!result) userById.links = [];

        else userById.links = result;

    });
    dbConnection.query(`SELECT * FROM service_cv.education WHERE user_id = ${req.params.id};`, 
    (err, result) => {

        if (!result) userById.education = [];

        else userById.education = result;

        res.json(userById);

        res.end();

    });
});




//Add user 
server.post("/registration", (req, res) => {

    var userok = req.body;

    userok.password = md5(userok.password);

    funcForDB.insertUser(userok, res, dbConnection);

});


//add userObject
server.post("/userObject", (req, res) => {
    
    const user = req.body;


    funcForDB.insertUpdateUser(user, dbConnection);

    funcForDB.insertUpdateJobs(user, dbConnection);

    funcForDB.insertUpdateLinks(user, dbConnection);

    funcForDB.insertUpdateEducation(user, dbConnection);


    res.end();

});


//Delete job by id
server.delete('/job/:id', (req, res) => {

    funcForDB.deleteJob(req, dbConnection);


    res.json({ "job": ' deleted.' });

    res.end();

});


//Delete link by id
server.delete('/link/:id', (req, res) => {

    funcForDB.deleteLink(req, dbConnection);


    res.json({ "link": ' deleted.' });

    res.end();

});


//Delete education by id
server.delete('/education/:id', (req, res) => {

    funcForDB.deleteEducation(req, dbConnection);


    res.json({ "education": ' deleted.' });

    res.end();

});


const startupCallback = function () {

    console.log(`Server started  at: http://localhost:${service.address().port}`);

};

const service = server.listen(SERVER_PORT, startupCallback);
