const { userGoogleController } = require("../controllers/UserGoogleController")

const userGoogleRoute = require("express").Router()

userGoogleRoute.post("/user-google", userGoogleController.register)
userGoogleRoute.post("/user-google/login", userGoogleController.login)
module.exports = {userGoogleRoute}