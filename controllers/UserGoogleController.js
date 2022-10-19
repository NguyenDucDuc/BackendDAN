const {UserGoogle} = require("../modelMongoDB/UserGoogle")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config()

const userGoogleController = {
    register: async (req,res) => {
        try {
            const user = await UserGoogle.find({email: req.body.email})
            if(user.length !== 0){
                return res.status(200).json(user)
            }else {
                const newUser = await UserGoogle.create({
                    username: req.body.username,
                    fullname: req.body.fullname,
                    avatar: req.body.avatar,
                    email: req.body.email
                })
                res.status(200).json(newUser)
            }
                
        } catch (error) {
            console.log(error)
        }
    },
    login: async (req,res) => {
        try {
            const user = await UserGoogle.find({email: req.body.email})
            if(user){
                const accessToken = jwt.sign({
                    id: user._id
                }, process.env.SECRET_KEY)
                res.status(200).json({accessToken, user})
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {userGoogleController}