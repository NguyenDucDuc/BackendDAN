const { incomeSpendingController } = require("../controllers/IncomeSpending")
const { middleWare } = require("../controllers/MiddleWare")
const {check} = require("express-validator")

const incomeSpendingRoute = require("express").Router()



incomeSpendingRoute.post("/income-spending",[
    check('money').notEmpty().withMessage("Money is not empty"),
    check('purpose').notEmpty().withMessage("Purpose is not empty"),
    check('type').notEmpty().withMessage("Type is not empty")
] ,middleWare.verifyToken, incomeSpendingController.add)
incomeSpendingRoute.get("/income-spending", incomeSpendingController.getAll)
incomeSpendingRoute.get("/income-spending/:id", incomeSpendingController.getDetail )
incomeSpendingRoute.delete("/income-spending/:id", middleWare.verifyToken, middleWare.verifyIncomeSpending, incomeSpendingController.delete)
incomeSpendingRoute.put("/income-spending/:id", middleWare.verifyToken, middleWare.verifyIncomeSpending, incomeSpendingController.update)
incomeSpendingRoute.get("/get-by-user",middleWare.verifyToken, incomeSpendingController.getByUser)
incomeSpendingRoute.get("/income-spending-count", middleWare.verifyToken, incomeSpendingController.count)
incomeSpendingRoute.get("/income-spending-total", middleWare.verifyToken, incomeSpendingController.total)
incomeSpendingRoute.get("/income-spending-count-spending-day", middleWare.verifyToken, incomeSpendingController.countSpending)
incomeSpendingRoute.get("/income-spending-total-income-month", middleWare.verifyToken, incomeSpendingController.totalIncomeMonth)
incomeSpendingRoute.post("/income-spending-jar", middleWare.verifyToken, incomeSpendingController.addWithJar)
incomeSpendingRoute.get("/income-spending-jar", middleWare.verifyToken, incomeSpendingController.getWithJar)
incomeSpendingRoute.get("/income-spending-jar-count", middleWare.verifyToken, incomeSpendingController.countSpendingJar)
incomeSpendingRoute.get("/income-spending-jar-calc", middleWare.verifyToken, incomeSpendingController.calcPercent)
incomeSpendingRoute.delete("/income-spending-jar/:spendingJarId", middleWare.verifyToken, middleWare.verifyDeleteSpendingJar, incomeSpendingController.deleteSpendingJar)

module.exports = {incomeSpendingRoute}