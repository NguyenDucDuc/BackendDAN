const { groupController } = require("../controllers/GroupController")
const { middleWare } = require("../controllers/MiddleWare")
const groupRoute = require("express").Router()
const {check} = require('express-validator')



groupRoute.post("/group", [
    check("groupname").notEmpty().withMessage("Group name is not empty"),
    check("purpose").notEmpty().withMessage("Group name must have purpose")
] ,middleWare.verifyToken ,groupController.add)
groupRoute.get("/group",middleWare.verifyToken, groupController.getGroupByUser)
groupRoute.get("/group/:id", groupController.getDetail)
groupRoute.put("/group/:id",middleWare.verifyToken, middleWare.verifyGroup, groupController.update)
groupRoute.delete("/group/:id", middleWare.verifyToken, middleWare.verifyGroup, groupController.delete)
groupRoute.post("/group/add-member/:groupId", middleWare.verifyToken, middleWare.verifyAddMember,
[
    
],groupController.addMember)

module.exports = {groupRoute}