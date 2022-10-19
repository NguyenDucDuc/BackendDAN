const { statsController } = require("../controllers/StatsController")
const { middleWare } = require("../controllers/MiddleWare")

const statsRoute = require("express").Router()


statsRoute.get("/stats/total-income/:userId", statsController.totalIncome)
statsRoute.get("/stats/total-spending/:userId", statsController.totalSpending)
statsRoute.get("/stats/total", middleWare.verifyToken, statsController.total)

module.exports = {statsRoute}