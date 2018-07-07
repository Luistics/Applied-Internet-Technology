const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {

    if(password.length < 8){

        const errObj = {message: "USERNAME OR PASSWORD TOO SHORT"};
        console.log(errObj);
        errorCallback(errObj);
    }

    else{

        if(username.length < 8){

            const errObj = {message: "USERNAME OR PASSWORD TOO SHORT"};
            console.log(errObj);
            errorCallback(errObj);
        }
        else{
            User.findOne({username: username}, (err, result) => {
                if(err){
                    console.log(err);
                }
                else if(result){
                    const errObj = {message: "USERNAME ALREADY EXISTS"};
                    console.log(errObj);
                    errorCallback(errObj);
                }
                else{

                    bcrypt.hash(password, 10, (err, hash) => {

                        if(err){
                            console.log(err);
                        }

                        const user = new User({
                            username: username,
                            password: hash,
                            email: email,
                        });

                        user.save(err => {

                            if(err){
                                const errObj = {message: "DOCUMENT SAVE ERROR"};
                                console.log(errObj);
                                errorCallback(errObj);
                            }

                            successCallback(user);

                        })

                    })
                }
            })
        }
    }

}


function login(username, password, errorCallback, successCallback) {

    User.findOne({username: username}, (err, user) => {

        if(err){
            console.log(err);
        }
        else if(!err && user){

            bcrypt.compare(password, user.password, (err, passwordMatch) => {

                if(passwordMatch){
                    successCallback(user);
                }
                else{
                    const errObj = {message: "PASSWORDS DO NOT MATCH"};
                    console.log(errObj);
                    errorCallback(errObj);
                }
            })

        }
        else{
            const errObj = {message: "USER NOT FOUND"};
            console.log(errObj);
            errorCallback(errObj);
        }

    })

}

function startAuthenticatedSession(req, user, cb){

    req.session.regenerate((err) => {

        if(!err){
            req.session.user = user;
            req.session.username = user.username;
            req.session.email = user.email;
            cb();
        }
        else{
            console.log(cb);
        }
    });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
