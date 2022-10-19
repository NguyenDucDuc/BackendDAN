const mongoose = require("mongoose")

const messageGroupSchema = new mongoose.Schema({
    userId: {
        type: Object,
        require: true,
    },
    groupId: {
        type: Object,
        require: true,
    },
    content: {
        type: String,
        require: true
    },
})

const MessageGroup = mongoose.model("MessageGroup", messageGroupSchema)
module.exports = {MessageGroup}