const express = require("express");
const bodyParser = require("body-parser");

const connString=require('./service/connection');

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

    dbConnection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, result) => {
        //console.dir(result);
        res.json(result);
        res.end();
            

    });

});


//Add users 
server.post("/", (req, res) => {

  
    dbConnection.query(`INSERT INTO users SET ?`,req.body[0],
    ` INSERT INTO jobs WHERE user_id=result.insertId SET?`, req.body[1]
    , (err, result) => {
       
      if(err)console.log(err);
      
        res.json(result); 
        //console.log(result.insertId);

        res.end();
            
    });

    //  dbConnection.query(`INSERT INTO users SET  ${req.body }`, req.body
   
    // , (err, result) => {
        
      
    //     res.json(result);
    //     res.end();
            
    // });
    // dbConnection.query('INSERT INTO contacts SET ?', req.body
   
    // , (err, result) => {
        
    //     result=true;
    //     res.json(result);
    //     res.end();
            
    // });

});


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



const startupCallback = function(){

    console.log(`Server started  at: http://localhost:${service.address().port}`);

};

const service = server.listen(SERVER_PORT, startupCallback);