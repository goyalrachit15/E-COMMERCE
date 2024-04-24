const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new schema({
    email : {
        type: String,
        required: true,
    }
    //username and password is already defined by passport local mongoose
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);