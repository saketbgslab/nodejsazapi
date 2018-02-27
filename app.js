var express = require('express');

var tempController = require('./controller/templateController');

var app = express();
app.set('view engine', 'ejs');
//app.use
app.listen(3000);

tempController.templateController(app);


/*
    var student = {
        first : req.body.fname,
        last : req.body.lname
    }

*/