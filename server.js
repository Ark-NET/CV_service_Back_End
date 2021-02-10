const express = require("express");
const bodyParser = require("body-parser");

const connString=require('./service/connection');

const server = new express();
server.use(bodyParser.json());
const SERVER_PORT = 5000;

//Инициализация подключения к MySQL
//Клиент для подключения к СУБД
const mysql = require("mysql");



const dbConnection = mysql.createConnection(connString);

dbConnection.connect((err) => {

    console.log("Connected to MySQL");

});

//Get all employee
server.get("/", (req, res) => {

        dbConnection.query("SELECT * FROM companydb.employee", (err, result) => {

            //console.log(result);
            res.json(result);
            res.end();
                
        });

});


//Get emplyee by id
server.get("/:id", (req, res) => {

    dbConnection.query(`SELECT * FROM companydb.employee WHERE id = ${req.params.id}`, (err, result) => {

        res.json(result);
        res.end();
            
    });

});


//Add emplyee 
server.post("/employee", (req, res) => {

  
    dbConnection.query('INSERT INTO employee SET ?', req.body
   
    , (err, result) => {
        
        result=true;
        res.json(result);
        res.end();
            
    });

});


//Update emplyee by id
server.put('/employee/:id', (req, res) => {

    const id = req.params.id;

    dbConnection.query('UPDATE employee SET ? WHERE id = ?', [req.body, id], (error, result) => {
        if (error) throw error;

        res.end('Employee updated successfully.');
    }); 
});

//Delete emplyee by id
server.delete('/employee/:id', (req, res) => {
    const id = req.params.id;

    dbConnection.query('DELETE FROM employee WHERE id = ?', id, (error, result) => {
        if (error) throw error;

        res.end('Employee deleted.');
    });
});



const startupCallback = function(){

    console.log(`Server started  at: http://localhost:${service.address().port}`);

};

const service = server.listen(SERVER_PORT, startupCallback);