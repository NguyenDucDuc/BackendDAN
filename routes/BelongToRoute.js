const { belongToController } = require("../controllers/BelongToController")
const { middleWare } = require("../controllers/MiddleWare")

const belongToRoute = require("express").Router()


belongToRoute.get("/belong-to/:groupId", belongToController.getUserByGroup)
belongToRoute.delete("/belong-to/:belongToId",middleWare.verifyToken, middleWare.verifyDeleteMember ,belongToController.deleteUserFromGroup)
belongToRoute.get("/belong-to-get-by-user", middleWare.verifyToken, belongToController.getGroupByUser)
belongToRoute.get("/belong-to-get-group-by-user-id/:userId", belongToController.getGroupByUserId)

module.exports = {belongToRoute}