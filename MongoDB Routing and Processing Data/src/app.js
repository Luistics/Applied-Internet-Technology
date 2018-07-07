// app.js
// lao294

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
require('./db');

const mongoose = require('mongoose');
const Review = mongoose.model('Review');


const publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));


const sessionOptions = {
    secret: 'such secret',
    resave: false,
    saveUninitialized: false
};
app.use(session(sessionOptions));


app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');


function sessionCounter(req, res, next){
    res.locals.count = req.session.count;
    next();
}

/*
function reviewsAdded(req, res, next){
    next();
}
*/

app.use(sessionCounter);
//app.use(reviewsAdded);

app.get('/', function(req,res){

    if(res.locals.count === undefined){
        res.locals.count = 1;
        req.session.count = 1;
    }

    req.session.count += 1;
    const semester = req.query.semester;
    const year = req.query.year;
    const professor = req.query.professor;

    //Not sure if there is a better condensed way to do the following:

    if(!semester && !year && !professor){

        Review.find({}, function(err, reviews){

            if(err){
                console.log(err);
            }

            res.render('index', {reviews: reviews});

        });
    }

    else if(semester === "all"){

        if(!year && !professor){
            Review.find({}, function(err, reviews){

                if(err){
                    console.log(err);
                }

                res.render('index', {reviews: reviews});
            });
        }
        else if(!professor){
            Review.find({year: year}, function(err, reviews){

                if(err){
                    console.log(err);
                }

                res.render('index', {reviews: reviews});
            });
        }
        else if(!year) {
            Review.find({professor: professor}, function(err, reviews){

                if(err){
                    console.log(err);
                }

                res.render('index', {reviews: reviews});
            });
        }
        else{
            Review.find({year: year, professor: professor}, function(err, reviews){

                if(err){
                    console.log(err);
                }

                res.render('index', {reviews: reviews});
            });
        }
    }

    else if(!year && !professor){

        Review.find({semester: semester}, function (err, reviews) {

                if(err){
                    console.log(err);
                }

                res.render('index', {reviews: reviews});

            });

    }

    else if(!year){

        Review.find({semester: semester, professor: professor}, function (err, reviews) {

            if(err){
                console.log(err);
            }

            res.render('index', {reviews: reviews});

        });

    }

    else if(!professor){

        Review.find({semester: semester, year: year}, function (err, reviews) {

            if(err){
                console.log(err);
            }

            res.render('index', {reviews: reviews});

        });

    }

    else{

        Review.find({semester:semester, year:year, professor: professor},function(err, reviews){

            if(err){
                console.log(err);
            }

            res.render('index', {reviews: reviews});

        });
    }



});


app.get('/reviews/add', function(req, res){

    req.session.count += 1;
    res.render('addReview');

});


app.post('/reviews/add', function(req, res){

    new Review({
        courseNumber: req.body.courseNumber,
        courseName: req.body.courseName,
        semester: req.body.semester,
        year: req.body.year,
        professor: req.body.professor,
        review: req.body.review,
        sessionID: req.session.id,
    }).save(function(err, review){
        res.redirect('/');
    });

});

app.get('/reviews/mine', function(req, res){

    req.session.count += 1;
    Review.find({sessionID:req.session.id}, function(err, reviews){

        if(err){
            console.log(err);
        }

        res.render('myReviews', {reviews: reviews});

    });
});


app.listen(3000);
console.log("Serving on port 3000");