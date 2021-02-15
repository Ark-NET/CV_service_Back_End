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




// //Add users 
// server.post("/registration", (req, res) => {
// var userok=req.body;
//     dbConnection.query(`INSERT INTO users SET?`, userok
//         // console.log(res)
//         // `Select @lastid:=result.insertId();`+
//         // ``, req.body[1]
//         , (err, result) => {
//             // var ob={
//             //     "job": "poster",
//             //     "work_status": "poc",
//             //     "from_year": "2009-08-02",
//             //     "to_year": "2020-06-05",
//             //     "about": "yuiijkwecf?erwfhilnrf<eerfh;erf",
//             //     "user_id":result.insertId
//             // }
//            // let isertID=
//             if (err) console.log(err);

//            // res.json(result);
//             //console.log(result.insertId);

// userok.user_id=result.insertId

//             res.end();
//         },
//         dbConnection.query(`INSERT INTO jobs SET?`, userok
//         , (err, result) => {
//             if (err) console.log(err);
//             res.json(result);
//             //console.log(result.insertId);
//             res.end();
//         })

//     );

//     //  dbConnection.query(`INSERT INTO users SET  ${req.body }`, req.body
//     // , (err, result) => {
//     //     res.json(result);
//     //     res.end();      
//     // });
//     // dbConnection.query('INSERT INTO contacts SET ?', req.bod
//     // , (err, result) => {
//     //     result=true;
//     //     res.json(result);
//     //     res.end();        
//     // });

// });


//Update users by id
server.put('/users/:id', (req, res) => {

    const id = req.params.id;

    dbConnection.query('UPDATE users SET ? WHERE id = ?', [req.body, id], (error, result) => {
        if (error) throw error;

        res.end('Users updated successfully.');
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