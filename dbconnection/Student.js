const db = require('./dbconnect');
const bcrypt = require('bcrypt');

function Student() {};

Student.prototype = {
    // Find the Student data by studentid or username.
    find : function(student = null, callback)
    {
        // if the student variable is defind
        if(student) {
            // if student = number return field = studentid, if student = string return field = username.
            var field = Number.isInteger(student) ? 'studentid' : 'username';
        }
        // prepare the sql query
        let sql = `SELECT * FROM students WHERE ${field} = ?`;

        db.query(sql, student, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    // This function will insert data into the database. (create a new student)
    // body is an object 
    create : function(body, callback) 
    {

        var pass = body.password;
        // Hash the password before insert it into the database.
        body.password = bcrypt.hashSync(pass,10);

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO students(username, fullname, password) VALUES (?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        db.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    login : function(username, password, callback)
    {
        // find the student data by his username.
        this.find(username, function(student) {
            // if there is a student by this username.
            if(student) {
                // now we check his password.
                if(bcrypt.compareSync(password, student.password)) {
                    // return his data.
                    callback(student);
                    return;
                }
            }
            // if the studentname/password is wrong then return null.
            callback(null);
        });

    }

}

module.exports = Student;