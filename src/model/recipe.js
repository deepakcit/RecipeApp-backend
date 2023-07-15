const mongoose = require("mongoose");

const recipeSch = mongoose.Schema({
    email:{type:String},
    username:{type:String},
    recipename:{type:String},
    ingredients:{type:String},
    instructions:{type:String},
    image:{type:String},
})

const Recmodel = mongoose.model("recipes",recipeSch);

module.exports = Recmodel;