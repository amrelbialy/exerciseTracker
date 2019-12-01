const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username :{
        type : String,
         trim: true,
        minlength: 3
    },
    count: Number,
    log : [{ description: String, duration: Number, date: Date }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;