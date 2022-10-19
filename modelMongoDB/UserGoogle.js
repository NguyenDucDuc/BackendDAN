const mongoose = require("mongoose")

const userGoogle = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    fullname: {
        type: String,
    },
    avatar: {
        type: String
    }
})

const UserGoogle = mongoose.model("UserGoogle", userGoogle)
module.exports = {UserGoogle}