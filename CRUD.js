
module.exports.getJobs = function getJobs(obj, dbConnection) {

    dbConnection.query(`SELECT * FROM service_cv.jobs WHERE user_id = ${obj.id};`, (err, result) => {

        return result;

    });

}



module.exports.getLinks = function getLinks(obj, dbConnection) {

    dbConnection.query(`SELECT * FROM service_cv.links WHERE user_id = ${obj.id};`,

        (err, result) => {

            return result;

        });

}


module.exports.getEducation = function getEducation(obj, dbConnection) {

    dbConnection.query(`SELECT * FROM service_cv.education WHERE user_id = ${obj.id};`,

        (err, result) => {

            return result;

        });

}


module.exports.insertUser = function insertUser(obj, response, dbConnection) {

    dbConnection.query(`INSERT INTO users(login,password,full_name,email,phone,position,face)
    VALUES (
            "${obj.login}", 
            "${obj.password}", 
            "${obj.full_name}", 
            "${obj.email}", 
            "${obj.phone}",
            "${obj.position}", 
            "${obj.face}")`,
        (err, result) => {

            if (err) {

                response.json({ "result": err });

            }
            else {

                response.json({ "result": true, "id": result.insertId });

            }

            response.end();

        });
}


module.exports.insertUpdateUser = function insertUpdateUser(obj, dbConnection) {

    if (obj.id > 0) {
        dbConnection.query(`UPDATE users
        SET 
         login="${obj.login}", 
            password="${obj.password}", 
            full_name="${obj.full_name}", 
            email="${obj.email}",
            phone="${obj.phone}",
            position = "${obj.position}",
            face="${obj.face}"
            WHERE id=${obj.id};`,
            (err, result) => {
                console.log("UPDATE users: " + err);

            });
    }
    else {
        dbConnection.query(`INSERT INTO users(  
                  
            login, 
            password, 
            full_name, 
            email, 
            phone, 
            position,
            face)
            VALUES (
                "${obj.login}", 
                    "${obj.password}", 
                    "${obj.full_name}", 
                    "${obj.email}", 
                    "${obj.phone}",
                    "${obj.position}", 
                    "${obj.face}")`,
            (err, result) => {

                console.dir("INSERT INTO users: " + err);

            });

    }

}


module.exports.insertUpdateJobs = function insertUpdateJobs(obj, dbConnection) {

    obj.jobs.forEach(element => {

        if (element.id > 0) {

            dbConnection.query(`UPDATE jobs
            SET
             id=${element.id},
             job="${element.job}", 
            work_status="${element.work_status}", 
            from_year="${element.from_year}", 
            to_year="${element.to_year}",
            about="${element.about}",
            user_id=${obj.id}
            WHERE id=${element.id};`,
                (err, result) => {

                    console.log("UPDATE jobs: " + err);

                });

        }
        else {

            dbConnection.query(`INSERT INTO jobs(
                job,
                work_status,
                from_year,
                to_year,
                about,
                user_id)
                VALUES ("${element.job}",
                        "${element.work_status}",
                        "${element.from_year}",
                        "${element.to_year}",
                        "${element.about}",
                        "${obj.id}") `,
                (err, result) => {

                    console.log("INSERT INTO jobs: " + err);

                });
        }
    })
}


module.exports.insertUpdateEducation = function insertUpdateEducation(obj, dbConnection) {

    obj.education.forEach(element => {

        if (element.id > 0) {

            dbConnection.query(`UPDATE education
            SET
            name="${element.name}", 
            specialization="${element.specialization}", 
            from_year="${element.from_year}", 
            to_year="${element.to_year}",
            about="${element.about}",
            user_id="${obj.id}"
            WHERE id=${element.id};`,
                (err, result) => {

                    console.log("UPDATE education: " + err);

                });

        }
        else {

            dbConnection.query(`INSERT INTO education(
                name,
                specialization,
                from_year,
                to_year,
                about,
                user_id)
                VALUES ("${element.name}",
                        "${element.specialization}",
                        "${element.from_year}",
                        "${element.to_year}",
                        "${element.about}",
                        "${obj.id}") `,
                (err, result) => {

                    console.log("INSERT INTO education: " + err);

                });
        }
    })

}


module.exports.insertUpdateLinks = function insertUpdateLinks(obj, dbConnection) {

    obj.links.forEach(element => {

        if (element.id > 0) {

            dbConnection.query(`UPDATE links
            SET
            name="${element.name}", 
            link="${element.link}", 
            user_id="${obj.id}"
            WHERE id=${element.id};`,
                (err, result) => {

                    console.log("UPDATE links: " + err);

                });

        }
        else {

            dbConnection.query(`INSERT INTO links(
                name,
                link,
                user_id)
                VALUES ("${element.name}",
                        "${element.link}",
                        "${obj.id}")`,
                (err, result) => {

                    console.log("INSERT INTO links: " + err);

                });
        }
    })

}


module.exports.deleteJob = function deleteJob(obj, dbConnection) {

    dbConnection.query("DELETE FROM jobs WHERE id=?", obj.params.id,
        (err, result) => {

            if (err) console.log(err);

        })
}


module.exports.deleteLink = function deleteLink(obj, dbConnection) {

    dbConnection.query("DELETE FROM links WHERE id=?", obj.params.id,
        (err, result) => {

            if (err) console.log(err);

        })

}


module.exports.deleteEducation = function deleteEducation(obj, dbConnection) {

    dbConnection.query("DELETE FROM education WHERE id=?", obj.params.id,
        (err, result) => {

            if (err) console.log(err);

        })
}
