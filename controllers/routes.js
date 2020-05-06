const express = require('express');
const Student = require('../models/Students');
const Coursework = require('../models/Courseworks');
const controller = express.Router();

// create an object from the class student in the file models/Student.js
const studentDAO = new Student('students.db');
studentDAO.init();

// create an object from the class coursework in the file models/Coursework.js
const courseworkDAO = new Coursework('courseworks.db');
courseworkDAO.init();

// Get the index/login page
controller.get('/', (req, res) => {
    let student = req.session.student;
    // If there is a session named student that means user is logged in. so we redirect him to home page by using /home route below
    if(student) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('index', {title:"Coursework Scheduling Application"});
})

controller.get('/register',(req,res)=> {
    res.render('register',{title:'Coursework Scheduling Application'});
});
// Get home page
controller.get('/home', (req, res) => {
    let student = req.session.student;

    if(student) {
        res.render('home', {opp:req.session.opp, name:student.fullname, title:"Coursework Scheduling Application"});
        return;
    }
    res.redirect('/');
});

// Get view add coursework page
controller.get('/view-add-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
       res.render('view-add-coursework', {opp:req.session.opp, name:student.fullname, studentid:student.studentid});
       return;
    }
    res.redirect('/');
});

// Post add coursework
controller.post('/add-coursework', (req, res) => {
    let student = req.session.student;
    // prepare an object containing all coursework.
    let title = req.body.title;
    let milestones = req.body.milestones;
    let duedate = req.body.duedate;
    let completiondate = req.body.completiondate;
    let username = req.session.student.username;

    // call create function. to create a new coursework
    courseworkDAO.addCoursework(title, milestones, duedate, completiondate, username).then((results) => {
        if(results){
            res.render('view-add-coursework', {opp:req.session.opp, name:student.fullname, studentid:student.studentid, successmsg:"Coursework added successfully"});
        }else{
            console.log('Error adding new coursework...');
            res.render('view-add-coursework', {opp:req.session.opp, name:student.fullname, studentid:student.studentid, errormsg:"Error adding new Coursework"});
        }
    }).catch((err) => {
        console.log('Error adding new coursework...', err);
        res.render('view-add-coursework', {opp:req.session.opp, name:student.fullname, studentid:student.studentid, errormsg:"Error adding new Coursework"});
    });;
});

// Get view all coursework page
controller.get('/view-all-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
        courseworkDAO.getAllIncompleteCourseworks(student.username).then((results) => {
            let courseworks = [];
            if(results){
                    results.forEach(function(item){
                    let coursework = {'title':item.title, 'milestones':item.milestones, 'duedate':item.duedate, 'completiondate':item.completiondate,'completed':item.completed == 0 ? "No":"Yes"};
                    courseworks.push(coursework);
                });
            }
            res.render('view-all-coursework', {opp:req.session.opp, name:student.fullname, courseworks:courseworks});
            return;
        });
    }else{
        res.redirect('/');
    }
});

// Get view modify coursework page
controller.get('/view-modify-coursework', (req, res) => {
    let student = req.session.student;

    if (student) {
        courseworkDAO.getAllCourseworks(student.username).then((results) => {
            if (results) {
                res.render('view-modify-coursework', { opp: req.session.opp, name: student.fullname, courseworks: results });
            }
            return;
        });
    } else {
        res.redirect('/');
    }
});

//post modify coursework
controller.post('/modify-it', (req, res) => {
    let student = req.session.student;

    if (student) {
        let coursework = {
            _id : req.body.courseworkid,
            title : req.body.title,
            milestones : req.body.milestones,
            duedate : req.body.duedate,
            completiondate : req.body.completiondate,
            completed : req.body.completed == "true" ? true:false
        };

        courseworkDAO.updateCoursework(student.username, coursework).then((status)=>{
            if(status){
                res.render('modify-coursework', { opp: req.session.opp, name: student.fullname, successmsg: "Coursework modified successfully", coursework: coursework});
            }else{
                res.render('modify-coursework', { opp: req.session.opp, name: student.fullname, errormsg: "Error modifying coursework", coursework: coursework});
            }
        });
    } else {
        res.redirect('/');
    }

});

// get modify page
controller.get('/modify', function (req, res) {
    let student = req.session.student;
    if(student){
        let courseworkid = req.query.id;
        courseworkDAO.getCoursework(courseworkid, student.username).then((results)=>{
            res.render('modify-coursework', { opp: req.session.opp, name: student.fullname, coursework: results });
        });
    } else {
        res.redirect('/');
    }
})

// Get view remove coursework page
controller.get('/view-remove-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
        courseworkDAO.getAllCourseworks(student.username).then((results)=>{
            let courseworksIdTitles = [];
            if(results){
                results.forEach(function(item){
                    let coursework = {'title':item.title, 'id':item._id};
                    courseworksIdTitles.push(coursework);
                });
            }
            res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles});
            return;
        });
    }else{
        res.redirect('/');
    }
});

// Post remove coursework page
controller.post('/remove-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
        let courseworksIdTitles = [];
        if(req.body.courseworkid == 0){
            res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles, errormsg:"Course not selected."});
        }else{
            courseworkDAO.deleteCoursework(req.body.courseworkid, student.username).then((numRemoved)=>{
                if(numRemoved){
                    courseworkDAO.getAllCourseworks(student.username).then((results)=>{
                        let courseworksIdTitles = [];
                        if(results){
                            results.forEach(function(item){
                                let coursework = {'title':item.title, 'id':item._id};
                                courseworksIdTitles.push(coursework);
                            });
                        }
                        res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles,successmsg:"Coursework successfully removed."});
                        return;
                    });
                }else{
                    res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles, successmsg:"Error removing coursework.Please try again..."});
                }
            }).catch((err) => {
                console.log('Error deleting coursework:', err);
                res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles, successmsg:"Error removing coursework.Please try again..."});
            });
        }
    }else{
        res.redirect('/');
    }
});

// Get view share coursework page
controller.get('/view-share-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
        let courseworksIdTitles = [];
        let studentsUsernameFullnames = [];
        courseworkDAO.getAllCourseworks(student.username).then((results)=>{
            if(results){
                results.forEach(function(item){
                    let coursework = {'title':item.title, 'id':item._id};
                    courseworksIdTitles.push(coursework);
                });
            }
        });
        studentDAO.getAllStudents().then((users)=>{
            if(users){
                users.forEach(function(item){
                    let user = {'fullname':item.fullname, 'username':item.username};
                    studentsUsernameFullnames.push(user);
                });
            }
        });
        res.render('view-share-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles, students:studentsUsernameFullnames});
        return;
    }else{
        res.redirect('/');
    }
});

// Post share coursework
controller.post('/share-coursework', (req, res) => {
    let student = req.session.student;

    if(student) {
        courseworkDAO.shareCoursework(req.body.courseworkid, student.username, req.body.sharewithusername).then((coursework)=>{
            if(coursework){
                let courseworksIdTitles = [];
                let studentsUsernameFullnames = [];
                courseworkDAO.getAllCourseworks(student.username).then((results)=>{
                    if(results){
                        results.forEach(function(item){
                            let coursework = {'title':item.title, 'id':item._id};
                            courseworksIdTitles.push(coursework);
                        });
                        studentDAO.getAllStudents().then((users)=>{
                            if(users){
                                users.forEach(function(item){
                                    let user = {'fullname':item.fullname, 'username':item.username};
                                    studentsUsernameFullnames.push(user);
                                });
                                res.render('view-share-coursework', {opp:req.session.opp, name:student.fullname, courseworksIdTitles:courseworksIdTitles, students:studentsUsernameFullnames, successmsg:"You just shared your coursework."});
                                return;
                            }
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/');
    }
});

// Post login data
controller.post('/login', (req, res) => {
    // The data sent from the student are stored in the req.body object.
    // call our login function and it will return the result(the student data).
    studentDAO.login(req.body.username, req.body.password).then((result) => {
        if(result && result.length > 0) {
            // Store the student data in a session.
            req.session.student = result[0];
            req.session.opp = 1;

            // redirect the student to the home page.
            res.render('home', {opp:req.session.opp, name:result[0].fullname, title:"Coursework Scheduling Application:Home"});
        }else{
             // if the login function returns null send this error message back to the student.
             res.send('Username/Password incorrect!');
        }
    }).catch((err) => {
        console.log('Error retrieving login details:', err);
         // if the login function returns null send this error message back to the student.
        res.send('Username/Password incorrect!');
    });
});

// Post register data
controller.post('/register', (req, res) => {
    // prepare an object containing all student inputs.
    let username = req.body.username;
    let fullname = req.body.fullname;
    let password = req.body.password;
    let age = req.body.age;
    let programme = req.body.programme;

    studentDAO.login(username, password).then((result) => {
        if(result && result.length > 0) {
             res.send('Username already taken!');
             return;
        }
    });
    // call create function. to create a new student. if there is no error this function will return student's details.
    studentDAO.addStudent(username, password, fullname, age, programme).then((result) => {
        if(result){
            req.session.student = result;
            req.session.opp = 1;
            // redirect the student to the home page.
            res.render('home', {opp:req.session.opp, name:result.fullname, title:"Coursework Scheduling Application:Home"});
        }
    }).catch((err)=>{
        console.log('Error creating a new student ...', err);
        res.send('Registration failed!' + err);
    });
});


// Get loggout page
controller.get('/logout', (req, res) => {
    // Check if session exists
    if(req.session.student) {
        // destroy the session and redirect the student to the index/login page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = controller;