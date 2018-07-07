const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();
const Article = mongoose.model('Article');
const User = mongoose.model('User');


app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: true,
    saveUninitialized: true,
}));

app.use((req, res, next) => {

    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {

    Article.find({}, function(err, articles){

        if(err){
            console.log(err);
        }

        res.render('index', {articles: articles});

    });

});

app.get('/article/add', (req, res) => {


    if(!req.session.user){
        res.redirect('/login');
    }
    else{
        res.render('article-add');
    }

});

app.post('/article/add', (req, res) => {

    if(!req.session.user){
        res.redirect('/login');
    }
    else{
        new Article({
            title: req.body.title,
            url: req.body.url,
            description: req.body.description,
            user: req.session.user._id

        }).save(function(err, article){
            res.redirect('/');
        });
    }

});


app.get('/article/:slug', (req, res) => {


    Article.findOne({'slug': req.params.slug}).exec(function (err, foundArticle) {

        if (err) {
            res.redirect('/');
        }
        else {
            User.findOne({'_id': foundArticle.user}, function(err, poster){
                res.render('article-detail', {
                    'title': foundArticle.title,
                    'url': foundArticle.url,
                    'postedUser': poster.username,
                    'description': foundArticle.description
                });

            });

        }
    });


});

app.get('/register', (req, res) => {

    res.render('register');

});

app.post('/register', (req, res) => {

    auth.register(req.body.username, req.body.email, req.body.password, function error(errObj){
        res.render('register',{message: errObj.message});
    }, function success(user){
        auth.startAuthenticatedSession(req, user, function callback(){res.redirect('/')});
    });
});
        

app.get('/login', (req, res) => {

    res.render('login');

});

app.post('/login', (req, res) => {


    auth.login(req.body.username, req.body.password, function error(errObj){
        res.render('login',{message: errObj.message});
    }, function success(user){

        auth.startAuthenticatedSession(req, user, function callback(){res.redirect('/')});
    });


});

app.listen(3000);
console.log("Serving on port 3000");
