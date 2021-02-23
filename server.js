const express = require("express");
const bodyParser = require("body-parser");
const connString = require('./service/connection');
const funcForDB = require("./CRUD")
const server = new express();
const fs = require("fs");
const SERVER_PORT = 5000;
const mysql = require("mysql");


const dbConnection = mysql.createConnection(connString.connString);


dbConnection.connect((err) => {

    console.log("Connected to MySQL");

});
server.use(bodyParser.json());

const DB_FACE_USERS = "./service/usersFaseDB.json";

//IsUser By LoginPassword
server.post("/login", (req, respons) => {

    dbConnection.query(`SELECT * from users WHERE login = "${req.body.login}" and password = "${req.body.password}"`,
        (err, result) => {
            if (result.length == 0) {
                respons.json({ "result": false });
            }
            else { respons.json({ "result": true, "id": result[0].id }); }
            respons.end();
        });
});



let objDB = [

    { "id": 1, "title": "Комплектующие", "pid": null },

    { "id": 2, "title": "Ноутбуки", "pid": null },

    { "id": 3, "title": "Сумки под ноутбуки", "pid": 2 },

    { "id": 4, "title": "Сумки мужские", "pid": 3 },

    { "id": 5, "title": "Cумки мужские синие", "pid": 4 },

    { "id": 6, "title": "Жесткие диски", "pid": 1 },

    { "id": 7, "title": "Кабеля", "pid": 1 },

    { "id": 8, "title": "Кабеля HDMI", "pid": 7 },

    { "id": 9, "title": "Мониторы", "pid": null }
]
let objFront = [
    { "id": 1, "title": "Комплектующие", "pid": null },

    { "id": 2, "title": "Ноутбуки", "pid": null },

    { "id": 3, "title": "Сумки под ноутбуки", "pid": 2 },

    { "id": 4, "title": "Сумки мужские", "pid": 3 },

    { "id": 5, "title": "Cумки мужские синие", "pid": 4 },

    { "id": 6, "title": "Жесткие диски", "pid": 1 },

    { "id": 12, "title": "fee диски", "pid": 34 }]
let arrTarget = objDB.map(JSON.stringify);
let arrOut = objFront.map(JSON.stringify).filter(e => arrTarget.includes(e)).map(JSON.parse);
console.log(arrOut)


//Get all users
server.get("/", (req, res) => {

    dbConnection.query("SELECT * FROM users", (err, result) => {

        //console.log(result);
        res.json(result);
        res.end();
    });
});


function escapeRegExp(string){
    return string.replace(/T.+Z/, ""); 
  }
  console.log(escapeRegExp("2008-05-01T21:00:00.000Z"));

//Get user by id
server.get("/:id", (req, res) => {

    let userById = {};

    userById.education = funcForDB.getEducation(req, dbConnection);
    userById.jobs = funcForDB.getJobs(req, dbConnection);

    userById.links = funcForDB.getLinks(req, dbConnection);

   // console.log(userById);

    dbConnection.query(`SELECT * FROM service_cv.users WHERE id=${req.params.id};`, (err, result) => {

        let tempToFace = result.find(element => element.id == req.params.id);

        userById = result.find(element => element.id == req.params.id);

        fs.readFile(DB_FACE_USERS, (err, result) => {

            let resultDB = JSON.parse(result);

            userById.face = resultDB.find(element => element.id == tempToFace.face.toString()).value;

        });
    });
    dbConnection.query(`SELECT * FROM service_cv.jobs WHERE user_id = ${req.params.id};`, (err, result) => {
//console.log(result);
userById.jobs = result;

       
        

    });
    dbConnection.query(`SELECT * FROM service_cv.links WHERE user_id = ${req.params.id};`, (err, result) => {

        userById.links = result;

    });
    dbConnection.query(`SELECT * FROM service_cv.education WHERE user_id = ${req.params.id};`, (err, result) => {

        userById.education = result;
       // console.log(userById);

       userById.jobs.forEach(element => {

        element.from_year = element.from_year.replace(/T.+Z/, "");
    
    console.log(   element.from_year);
       
    });
        res.json(userById);
        res.end();
        
    });
});


// server.get("/:id", (req, res) => {
//     let userById = {};
//     dbConnection.query(`SELECT * FROM service_cv.users WHERE id=${req.params.id};`, (err, result) => {
// // console.log(result);
//         userById = result;
//  //console.log(userById); 
//  res.sent(userById);
//     });
//     dbConnection.query(`SELECT * FROM service_cv.jobs WHERE user_id = ${req.params.id};`, (err, result) => {
//         userById.jobs = result;
//        // res.json(userById);   res.end();
//        res.sent(userById);
//     });
//     // dbConnection.query(`SELECT * FROM service_cv.links WHERE user_id = ${req.params.id};`, (err, result) => {
//     //     userById.links = result;
//     // });
//     // dbConnection.query(`SELECT * FROM service_cv.education WHERE user_id = ${req.params.id};`, (err, result) => {
//     //     userById.education = result;
//     //     
//     // });
// });




//Add user 
server.post("/registration", (req, res) => {

    var userok = req.body;

    dbConnection.query(`INSERT INTO users SET?`, userok
        , (err, result) => {

            console.dir(result);

            if (!result) {

                res.json({ "result": false });

            }
            else { res.json({ "result": true, "id": result.insertId }); }

            res.end();

        });
});





//add userObject
server.post("/userObject", (req, res) => {

    const user = req.body;

    fs.readFile(DB_FACE_USERS, "utf8", (err, data) => {

        let faces = JSON.parse(data);
        let usersFace = faces.filter(face => face.id != user.id);
        let newUser = { "id": `${user.id}`, "value": `${user.face}` };

        usersFace = [...usersFace, newUser];

        if (user.face) {
            fs.writeFile(DB_FACE_USERS, JSON.stringify(usersFace), () => { });
            user.face = user.id;
        }


        // name(user, dbConnection);
        funcForDB.insertUpdateUser(user, dbConnection);
        funcForDB.insertUpdateJobs(user, dbConnection);
        funcForDB.insertUpdateLinks(user, dbConnection);
        funcForDB.insertUpdateEducation(user, dbConnection);


    });
    res.end();
});



//funcForDB.insertUpdateUser(polzovatel,dbConnection);
//funcForDB.insertUpdateJobs(polzovatel,dbConnection);
// funcForDB .insertUpdateLinks(polzovatel,dbConnection);
// funcForDB.insertUpdateEducation(polzovatel,dbConnection);




// //Update users by id
// server.put('/UpdateObj', (req, res) => {

//     const userObj = req.body;

//     dbConnection.query('UPDATE users SET ? WHERE id = ?', [req.body, id], (error, result) => {
//         if (error) throw error;

//         res.end('Users updated successfully.');
//     });

//     dbConnection.query(`SELECT * FROM jobs WHERE user_id = ${req.params.id}`, (err, result) => {

//         userById.jobs = result;

//     });
//     dbConnection.query(`SELECT * FROM links WHERE user_id = ${req.params.id}`, (err, result) => {

//         userById.links = result;

//     });
//     dbConnection.query(`SELECT * FROM education WHERE user_id = ${req.params.id}`, (err, result) => {

//         userById.education = result;
//         res.json(userById);
//         res.end();

//     });

// });


//Delete job by id
server.delete('/job/:id', (req, res) => {

    funcForDB.deleteJob(req, dbConnection);
    res.end('Users deleted.');

});


//Delete link by id
server.delete('/link/:id', (req, res) => {

    funcForDB.deleteLink(req, dbConnection);
    res.end('Users deleted.');

});


//Delete education by id
server.delete('/education/:id', (req, res) => {

    funcForDB.getEducation(req, dbConnection);
    res.end('Users deleted.');

});




const startupCallback = function () {

    console.log(`Server started  at: http://localhost:${service.address().port}`);

};

const service = server.listen(SERVER_PORT, startupCallback);


// dbConnection.query('DELETE FROM jobs WHERE id = 95', (error, result) => {
//     if (error) throw error;
// console.log("job-delete")
//     // res.end('Users deleted.');
// });

// var ou = [
//     {
//        "id":0,
//         "job": "ServiseCAr",
//         "work_status": "Developer",
//         "from_year": "2011-02-15",
//         "to_year": "2014-05-05",
//         "about": "big DATABASE",
//         "user_id": 1
//     },
//     {
//         "id":0,
//         "job": "RENAULT_SERVISE",
//         "work_status": "developer",
//         "from_year": "2014-08-31",
//         "to_year": "2015-12-31",
//         "about": "Work with Client",
//         "user_id": 1
//     },
//     {
//         "id":0,
//         "job": "BMW_Service",
//         "work_status": "developer",
//         "from_year": "2017-06-03",
//         "to_year": "2020-03-02",
//         "about": "e-cabinet Client",
//         "user_id": 1
//     }
// ]
// ou.forEach(element => {
//     console.dir(element);
//         dbConnection.query(`INSERT INTO jobs SET?`, element,
//             (err, result) => {
//            console.dir(result);    
//         })   
// })

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


// var polzovatel =  {
//     "id":357,
//     "full_name": "polzovatel_123",
//     "login": "poc",
//     "password": "gh456JL33",
//     "email": "polzovatel1@GMAIL.COM",
//     "phone": "+38099999999",

//     "jobs": [
//         {
//              "id":0,
//             "job": "shop",
//             "work_status": "consultant",
//             "from_year": "2009-12-15",
//             "to_year": "2011-02-05",
//             "about": "product",
//             "user_id": 0

//         },
//         {
//             "id":0,
//             "job": "RENAULT_SERVISE",
//             "work_status": "developer",
//             "from_year": "2014-08-31",
//             "to_year": "2015-12-31",
//             "about": "Work with Client",
//             "user_id": 0
//         },
//         {
//             "id":0,
//             "job": "BMW_Service",
//             "work_status": "developer",
//             "from_year": "2017-06-03",
//             "to_year": "2020-03-02",
//             "about": "e-cabinet Client",
//             "user_id": 0
//         }
//     ],
//     "links": [
//         {
//             "id": 0,
//             "name": "projectSTO",
//             "link": "http://ffkgolck",
//             "user_id": 33
//         },
//         {
//             "id": 0,
//             "name": "ServiseDetalisCar",
//             "link": "http://gh",
//             "user_id":33
//         }
//     ],
//     "education": [
//         {
//             "id": 0,
//             "name": "developer",
//             "specialization": "C#",
//             "from_year": "2008-05-02",
//             "to_year": "2009-05-02",
//             "about": "framework",
//             "user_id":33
//         },
//         {
//             "id":0,
//             "name": "developer",
//             "specialization": "PHP",
//             "from_year": "2010-05-02",
//             "to_year": "2010-11-02",
//             "about": "framework",
//             "user_id": 33
//         }
//     ]
//     }
