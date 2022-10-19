const { tempSpendingGroupController } = require("../controllers/TempSpendingGroupController")
const { middleWare } = require("../controllers/MiddleWare")
const tempSpendingGroupRoute = require("express").Router()

tempSpendingGroupRoute.post("/temp-spending-group", middleWare.verifyToken ,tempSpendingGroupController.add)
tempSpendingGroupRoute.get("/temp-spending-group/:groupId", tempSpendingGroupController.getByGroup)
tempSpendingGroupRoute.delete("/temp-spending-group/:tempSpendingGroupId", middleWare.verifyToken, middleWare.verifyDeleteSpendingTemp, tempSpendingGroupController.delete)


module.exports = {tempSpendingGroupRoute}