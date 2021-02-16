const express = require("express");
const bodyParser = require("body-parser");

const connString = require('./service/connection');

const server = new express();
server.use(bodyParser.json());
const SERVER_PORT = 5000;

//Инициализация подключения к MySQL
//Клиент для подключения к СУБД
const mysql = require("mysql");

const dbConnection = mysql.createConnection(connString.connString);

dbConnection.connect((err) => {

    console.log("Connected to MySQL");

});



//IsUser By LoginPassword
server.post("/login", (req, respons) => {

    dbConnection.query(`SELECT * from users WHERE login = "${req.body.login}" and password = "${req.body.password}"`
    , (err, result) => {
        if (result.length == 0) {
            respons.json({ "result": false });
        }
        else { respons.json({ "result": true, "id": result[0].id }); }
        respons.end();
    });
});



//Get all users
server.get("/", (req, res) => {

    dbConnection.query("SELECT * FROM users", (err, result) => {

        console.log(result);
        res.json(result);
        res.end();

    });
});



//Get users by id
server.get("/:id", (req, res) => {

    let userById = {};

    dbConnection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, result) => {

        userById = result[0];

    });
    dbConnection.query(`SELECT * FROM jobs WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.jobs = result;

    });
    dbConnection.query(`SELECT * FROM links WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.links = result;

    });
    dbConnection.query(`SELECT * FROM education WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.education = result;
        res.json(userById);
        res.end();

    });

});



//Add users 
server.post("/registration", (req, res) => {

    var userok = req.body;
 
    dbConnection.query(`INSERT INTO users SET?`, userok
      , (err, result) => {
        console.dir(result);
        if (!result) {
            res.json({ "result": false });
        }
        else { res.json({ "result": true, "id": result.insertId});}
        res.end();
    });
});

 




//add userObject
server.post("/userObject",(req,res)=>{
 var user=req.body


   // console.log("jifehfjifek")
   // console.dir(req.body.jobs);


// res.json(console.log("jifehfjifek"));
 res.end();
});







//Update users by id
server.put('/UpdateObj', (req, res) => {

    const userObj = req.body;
 
    dbConnection.query('UPDATE users SET ? WHERE id = ?', [req.body, id], (error, result) => {
        if (error) throw error;

        res.end('Users updated successfully.');
    });
  
    dbConnection.query(`SELECT * FROM jobs WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.jobs = result;

    });
    dbConnection.query(`SELECT * FROM links WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.links = result;

    });
    dbConnection.query(`SELECT * FROM education WHERE user_id = ${req.params.id}`, (err, result) => {

        userById.education = result;
        res.json(userById);
        res.end();

    });

});

//Delete users by id
server.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    dbConnection.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
        if (error) throw error;

        res.end('Users deleted.');
    });
});

const startupCallback = function () {

    console.log(`Server started  at: http://localhost:${service.address().port}`);

};

const service = server.listen(SERVER_PORT, startupCallback);


var ou = [
    {
       "id":0,
        "job": "ServiseCAr",
        "work_status": "Developer",
        "from_year": "2011-02-15",
        "to_year": "2014-05-05",
        "about": "big DATABASE",
        "user_id": 1
    },
    {
        "id":0,
        "job": "RENAULT_SERVISE",
        "work_status": "developer",
        "from_year": "2014-08-31",
        "to_year": "2015-12-31",
        "about": "Work with Client",
        "user_id": 1
    },
    {
        "id":0,
        "job": "BMW_Service",
        "work_status": "developer",
        "from_year": "2017-06-03",
        "to_year": "2020-03-02",
        "about": "e-cabinet Client",
        "user_id": 1
    }
]
ou.forEach(element => {
    console.dir(element);
        dbConnection.query(`INSERT INTO jobs SET?`, element,
            (err, result) => {
           console.dir(result);

        
        })   
})

// dbConnection.query(`SELECT * FROM jobs WHERE id = 1`,(err,result)=>{
//    if(!result){
//     dbConnection.query(`INSERT INTO jobs SET?`, userok
//             , (err, result) => {
//                 if (err) console.log(err);
//                 res.json(result);
//                 //console.log(result.insertId);
//                 res.end();
//             })
//    }
//    else{
//     dbConnection.query('UPDATE users SET ? WHERE id = ?', [req.body, id], (error, result) => {
//         if (error) throw error;

//         res.end('Users updated successfully.');
//     });
//    }
// })