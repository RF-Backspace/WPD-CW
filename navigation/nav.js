const express = require('express');
const Student = require('../dbconnection/Student');
const router = express.Router();

// create an object from the class student in the file dbconnection/studentoperations.js
const student = new Student();

// Get the index page
router.get('/', (req, res, next) => {
    let student = req.session.student;
    // If there is a session named student that means the use is logged in. so we redirect him to home page by using /home route below
    if(student) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('index', {title:"Coursework Scheduling Application"});
})

// Get home page
router.get('/home', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('home', {opp:req.session.opp, name:student.fullname});
        return;
    }
    res.redirect('/');
});

// Get view add coursework page
router.get('/view-add-coursework', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('view-add-coursework', {opp:req.session.opp, name:student.fullname});
       return;
    }
    res.redirect('/');
});

// Get view all coursework page
router.get('/view-all-coursework', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('view-all-coursework', {opp:req.session.opp, name:student.fullname});
        return;
    }
    res.redirect('/');
});

// Get view modify coursework page
router.get('/view-modify-coursework', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('view-modify-coursework', {opp:req.session.opp, name:student.fullname});
        return;
    }
    res.redirect('/');
});

// Get view remove coursework page
router.get('/view-remove-coursework', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('view-remove-coursework', {opp:req.session.opp, name:student.fullname});
        return;
    }
    res.redirect('/');
});

// Get view share coursework page
router.get('/view-share-coursework', (req, res, next) => {
    let student = req.session.student;

    if(student) {
        res.render('view-share-coursework', {opp:req.session.opp, name:student.fullname});
        return;
    }
    res.redirect('/');
});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the student are stored in the req.body object.
    // call our login function and it will return the result(the student data).
    student.login(req.body.username, req.body.password, function(result) {
        if(result) {
            // Store the student data in a session.
            req.session.student = result;
            req.session.opp = 1;
            // redirect the student to the home page.
            res.redirect('/home');
        }else {
            // if the login function returns null send this error message back to the student.
            res.send('Username/Password incorrect!');
        }
    })

});


// Post register data
router.post('/register', (req, res, next) => {
    // prepare an object containing all student inputs.
    let studentInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };
    // call create function. to create a new student. if there is no error this function will return it's id.
    student.create(studentInput, function(lastId) {
        // if the creation of the student goes well we should get an integer (id of the inserted student)
        if(lastId) {
            // Get the student data by it's id. and store it in a session.
            student.find(lastId, function(result) {
                req.session.student = result;
                req.session.opp = 1;
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new student ...');
        }
    });

});


// Get loggout page
router.get('/logout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.student) {
        // destroy the session and redirect the student to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;