const { messageGroupController } = require("../controllers/MessageGroupController")

const messageGroupRoute = require("express").Router()

messageGroupRoute.post("/message-group", messageGroupController.add)
messageGroupRoute.get("/message-group/:groupId", messageGroupController.getAll)


module.exports = {messageGroupRoute}