/* app.js */

const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'hbs');

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));


//middleware function
function logger(req, res, next){

    console.log(req.method + req.path);
    console.log("=====");

    console.log("req.query:", req.query);
    console.log("req.body:", req.body, "\n");

    next();
}

//app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);




const complaints = [
    {line:'A', complaint:'The train was an hour late!'},
    {line:'F', complaint:'There was a possum loose on the platform'},
    {line:'G', complaint:'The person sitting next to me was eating hard-boiled eggs in the subway car'},
];

/* Template for complaints page */
app.get('/', function(req,res){

    const line = req.query.line;
    if(!line){
        res.render('index', {allComplaints: complaints});
    }
    else{
        res.render('index', {allComplaints: complaints.filter(c => c.line === line)});
    }
});

app.get('/complain', function (req, res) {

    res.render('complain');

});


app.post('/complain', function(req, res) {

    const newComplaint = {line: req.body.line, complaint: req.body.complaint};
    complaints.unshift(newComplaint);

    res.redirect("/");
});






app.listen(3000);
console.log("Serving on port 3000");