const warningRoute = require("express").Router()
const { middleWare } = require("../controllers/MiddleWare")
const {warningController} = require("../controllers/WarningController")


warningRoute.post("/warning",middleWare.verifyToken, warningController.add)
warningRoute.get("/warning", middleWare.verifyToken,  warningController.getAll)
warningRoute.get("/warning-count", middleWare.verifyToken, warningController.count)
warningRoute.delete("/warning",middleWare.verifyToken ,warningController.deleteByContent)

module.exports = {warningRoute}