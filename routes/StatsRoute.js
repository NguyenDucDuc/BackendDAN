const { statsController } = require("../controllers/StatsController")
const { middleWare } = require("../controllers/MiddleWare")

const statsRoute = require("express").Router()


statsRoute.get("/stats/total-income/:userId", statsController.totalIncome)
statsRoute.get("/stats/total-spending/:userId", statsController.totalSpending)
statsRoute.get("/stats/total", middleWare.verifyToken, statsController.total)
statsRoute.get('/stats/count-user-group', statsController.countUserAndGroup)

module.exports = {statsRoute}