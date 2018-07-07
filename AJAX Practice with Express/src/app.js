const DEFAULT_AIT_PORT = 3000;

// database setup
require('./db');
const mongoose = require('mongoose');

// express
const express = require('express');
const app = express();

// static files
const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// body parser
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');

// mongoose schemas

const Review = mongoose.model('Review');

// routes

app.get('/api/reviews', function(req, res) {

    const query = {};

    if(req.query.semester)
        query.semester = req.query.semester;
    if(req.query.year)
        query.year = req.query.year;


    Review.find(query, function (err, reviews) {

        if (err) {
            console.log("error");
        }
        else {
            res.json(reviews);
        }
    });

});

app.post('/api/review/create', (req, res) => {

    const review = new Review({

        name: req.body.name,
        semester: req.body.semester,
        year: req.body.year,
        review: req.body.review,
    });

    review.save(function(err, review){

        if(err){
            res.json({error: err.message});
        }
        else{
            res.json(review);
        }
    });

});

app.listen(process.env.PORT || DEFAULT_AIT_PORT, (err) => {
  console.log('Server started (ctrl + c to shut down)');
});
