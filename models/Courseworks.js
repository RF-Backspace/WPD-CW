const Datastore = require('nedb');

class Courseworks {
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
            title: 'Temp Coursework', milestones: 'Temp Milestones', duedate: '2020-05-12', completiondate: '2020-05-10', completed: false, username: 'tempuser'
        }, function (err, coursework) {
            if (err) {
                console.log('Eror inserting coursework into the database', err);
            } else {
                console.log('Coursework inserted into database - ' + coursework);
            }
        });
    };

    //insert a new coursework
    addCoursework(title, milestones, duedate, completiondate, username) {
        return new Promise((resolve, reject) => {
            var entry = {
                title:title,
                milestones:milestones,
                duedate: duedate,
                completiondate: completiondate,
                completed: false,
                username:username
            };

            this.db.insert(entry, function (err, coursework) {
                if (err) {
                    console.log("Error inserting document into database", err);
                    reject(err);
                } else {
                    console.log('add coursework:', coursework);
                    resolve(coursework);
                }
            });
        });
    }

    //retrieve all Courseworks
    getAllCourseworks(username) {
        return new Promise((resolve, reject) => {
            this.db.find({"username":username}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('getAllCourseworks Promise rejected -', err);
                } else {
                    resolve(entries);
                    console.log('getAllCourseworks Promise resolved');
                }
            });
        });
    }

    //retrieve coursework
    getCoursework(courseworkid, username) {
        return new Promise((resolve, reject) => {
            this.db.find({"_id":courseworkid, "username":username}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('getCoursework Promise rejected -', err);
                } else {
                    resolve(entries);
                    console.log('getCoursework Promise resolved');
                }
            });
        });
    }

    //retrieve all Incomplete Courseworks
    getAllIncompleteCourseworks(username) {
        console.log(username);
        return new Promise((resolve, reject) => {
            this.db.find({"completed": false, "username":username}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('getAllIncompleteCourseworks Promise rejected -', err);
                } else {
                    resolve(entries);
                    console.log('getAllIncompleteCourseworks Promise resolved');
                }
            });
        });
    }

    //update coursework
    updateCoursework(username, coursework) {
        return new Promise((resolve, reject) => {
            let courseworkid = coursework._id, newTitle=coursework.title, newMilestones=coursework.milestones, newDueDate=coursework.duedate, newCompletionDate=coursework.completiondate;
            this.db.update({ "_id": courseworkid , "username": username}, { $set: { "title": newTitle, "milestones": newMilestones, "duedate": newDueDate, "completiondate": newCompletionDate , "completed": coursework.completed} },
                function (err, numReplaced) {
                    if (err) {
                        console.log('Error updating coursework', title, err);
                        reject(err);
                    } else {
                        console.log('updated coursework');
                        resolve(numReplaced);
                    }
                });
        });
    }

    //share Coursework
    shareCoursework(courseworkid, username, sharingUsername) {
        return new Promise((resolve, reject) => {
            let that = this;
            this.db.find({"username":username, "_id":courseworkid}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('find rejected during share -', err);
                } else {
                    var entry = {
                        title:entries[0].title,
                        milestones:entries[0].milestones,
                        duedate: entries[0].duedate,
                        completiondate: entries[0].completiondate,
                        completed: entries[0].completed,
                        username:sharingUsername
                    };
                    that.db.insert(entry, function (err, coursework) {
                        if (err) {
                            console.log("Error inserting document into database", err);
                            reject(err);
                        } else {
                            console.log('coursework shared:', coursework);
                            resolve(coursework);
                        }
                    });
                }
            });
        });
    }

     //delete single Coursework identified by id & username
     deleteCoursework(courseworkid, username) {
        return new Promise((resolve, reject) => {
            this.db.remove({ "_id": courseworkid, "username": username }, {}, function (err, numRemoved) {
                if (err) {
                    console.log('Error deleting coursework', courseworkid, err);
                    reject(err);
                } else {
                    console.log('delete Coursework:', courseworkid, numRemoved);
                    resolve(numRemoved);
                }
            });
        });
    }
}

module.exports = Courseworks;