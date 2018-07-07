//db.js
//lao294


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = new Schema({

    courseNumber : String,
    courseName : String,
    semester : String,
    year : Number,
    professor : String,
    review : String,
    sessionID: String

});

mongoose.model('Review', Review);
mongoose.connect('mongodb://localhost/hw05');
