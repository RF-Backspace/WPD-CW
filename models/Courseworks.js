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
                    console.log('getAllCourseworks Promise resolved -', entries);
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
                    console.log('getAllIncompleteCourseworks Promise resolved -', entries);
                }
            });
        });
    }

    //update Coursework
    updateCoursework(courseworkid, username, updatedTitle, updatedMilestones, updatedDuedate, updatedCompletiondate, updatedCompleteStatus) {
        return new Promise((resolve, reject) => {
            this.db.update({"_id": courseworkid, "username": username}, { $set: { "title": updatedTitle, "milestones": updatedMilestones, "duedate": updatedDuedate, "completiondate": updatedCompletiondate, "completed":updatedCompleteStatus }},
            function (err, numUpdated) {
                if (err) {
                    console.log('Error updating coursework', courseworkid, err);
                    reject(err);
                } else {
                    console.log('updated coursework:', courseworkid, numUpdated);
                    resolve(entries);
                }
            });
        });
    }

    //share Coursework
    shareCoursework(courseworkid, username, sharingUsername) {
        return new Promise((resolve, reject) => {
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
                    this.db.insert(entry, function (err, coursework) {
                        if (err) {
                            console.log("Error inserting document into database", err);
                            reject(err);
                        } else {
                            console.log('add coursework:', coursework);
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