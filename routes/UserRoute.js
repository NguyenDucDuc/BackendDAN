const { userController } = require("../controllers/UserController")
const {check, validationResult} = require("express-validator")
const userRoute = require("express").Router()
const { middleWare } = require("../controllers/MiddleWare")


userRoute.post("/user",userController.register)
userRoute.post("/user/login", 
[
    check('username').notEmpty().withMessage("username is not empty"),
    check('password').notEmpty().withMessage("password is not empty")
],userController.login)
userRoute.get("/user", userController.getAll)
userRoute.get("/user/current-user",middleWare.verifyToken, userController.currentUser )
userRoute.post("/user/google-login", userController.getOrCreate)
userRoute.post("/user/google-login-email", userController.googleLogin)
userRoute.post("/user/lock/:userId", middleWare.verifyToken, middleWare.verifyLockUser, userController.lock)
userRoute.get("/user/get-one/:userId", userController.getOne)
userRoute.post("/user/login-admin", userController.loginAdmin)
userRoute.get("/user/count", userController.countAllUser)
userRoute.post("/user/forget-password", userController.forgetPassWord)
userRoute.post("/user/reset-password", userController.resetPassword)
userRoute.post("/user/facebook", userController.facebookGetOrCreate)


module.exports = {userRoute}