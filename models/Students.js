const Datastore = require('nedb');

class Students {
    constructor(dbfilePath){
        if(dbfilePath){
            this.db = new Datastore({filename: dbfilePath, autoload: true});
        }else{
            this.db = new Datastore();
        }
    }
    // method to seed the database for in-memory use
    init() {
        this.db.insert({
            username: 'tempuser', password: 'temp', fullname: 'Xman', age: 20, programme: 'Computing'
        }, function (err, doc) {
            if (err) {
                console.log('Eror inserting document Xman into the database', err);
            } else {
                console.log('Temp Student inserted into database');
            }
        });
    };

    //insert a new student
    addStudent(username, password, fullname, age, programme) {
        return new Promise((resolve, reject) => {
            var entry = {
                username:username,
                password:password,
                fullname: fullname,
                age: age,
                programme: programme
            };

            this.db.insert(entry, function (err, student) {
                if (err) {
                    console.log("Error inserting document into database", err);
                    reject(err);
                } else {
                    console.log('add student:', username);
                    resolve(student);
                }
            });
        });
    }

    //retrieve all students
    getAllStudents() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('getAllStudents Promise rejected');
                } else {
                    resolve(entries);
                    console.log('getAllStudents Promise resolved');
                }
            });
        });
    }

    //get one student by username & password
    login(username, password) {
        return new Promise((resolve, reject) => {
            this.db.find({ "username": username, "password": password }, function (err, student) {
                if (err) {
                    console.log('login Promise rejected for ', username);
                    reject(err);
                } else {
                    console.log('login Promise resolved for ', student);
                    resolve(student);
                }
            });
        });
    }
}

module.exports = Students;