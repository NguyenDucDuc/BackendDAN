
const { groupController } = require("../controllers/GroupController")
const { middleWare } = require("../controllers/MiddleWare")
const { spendingGroupController } = require("../controllers/SpendingGroupController")

const spendingGroupRoute = require("express").Router()

spendingGroupRoute.post("/spending-group", middleWare.verifyToken, spendingGroupController.add)
spendingGroupRoute.get("/spending-group/:userId", spendingGroupController.getByUserId)
spendingGroupRoute.put("/spending-group/:id", middleWare.verifyToken, middleWare.verifySpendingGroup, spendingGroupController.update)
spendingGroupRoute.delete("/spending-group/:id", middleWare.verifyToken, middleWare.verifyGroup, spendingGroupController.delete) 
spendingGroupRoute.get("/spending-group-detail/:groupId", spendingGroupController.detailSpending)

module.exports = {spendingGroupRoute}