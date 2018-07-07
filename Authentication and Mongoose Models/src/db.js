const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
// use plugins (for slug)
// register your model

const Schema = mongoose.Schema;
const UserSchema = new Schema({

    username : {type: String, required: true},
    email : {type: String, required: true},
    password : {type:String, unique: true, required: true},

});

const ArticleSchema = new Schema({

    title: String,
    url: String,
    description: String,
    user: {type:Schema.Types.ObjectId, ref: 'User'}

});

ArticleSchema.plugin(URLSlugs('title'));

mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);

mongoose.connect('mongodb://localhost/hw06');
