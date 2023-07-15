const mongoose = require("mongoose");

const regisSch = mongoose.Schema({
    email:{type:String,unique:true},
    password:{type:String}
})

const Usermodel = mongoose.model("users",regisSch);

module.exports = Usermodel;