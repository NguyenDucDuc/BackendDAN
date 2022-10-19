const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { User, sequelize } = require("../models")
const { cloudinary } = require("../config/CloudinaryConfig")
const dotenv = require("dotenv")
const { validationResult, check } = require("express-validator")
const OTP = require("otp-generator")
const nodemailer = require("nodemailer")
const cookies = require("cookies")
dotenv.config()


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nguyenducduc2441@gmail.com", // generated ethereal user
        pass: "yeaaexhzluzpzgxq", // generated ethereal password
    },
});

const userController = {
    register: async (req, res) => {
        try {
            const file = req.files.avatar
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                public_id: `${Date.now()}`,
                resource_type: "auto",
                folder: "Avatar"
            })
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)
            const newUser = await User.create({
                fullname: req.body.fullname,
                username: req.body.username,
                password: hashed,
                active: 1,
                role: req.body.role,
                email: req.body.email,
                avatar: result.secure_url
            })

            res.status(201).json(newUser)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    login: async (req, res) => {
        try {
            // const errors = validationResult(req)
            // if(!errors.isEmpty()){
            //     return res.status(300).json(errors.array())
            // }
            const user = await User.findOne({ where: { username: req.body.username } })

            const validPassword = await bcrypt.compare(req.body.password, user.password)
            
            if (user && validPassword) {
                if (user.active === 0) {
                    return res.status(500).json("Tài khoản của bạn đã bị khóa!")
                }
                const accessToken = await jwt.sign({
                    id: user.id,
                }, process.env.SECRET_KEY)
                setTimeout(() => {
                    res.status(200).json({ accessToken, user })
                }, 1000)
            } else {
                return res.status(500).json("Tài khoản hoặc mật khẩu không chính xác!")
            }

        } catch (error) {
            res.status(500).json("Tài khoản hoặc mật khẩu không chính xác!")
        }
    },
    getAll: async (req, res) => {
        try {
            const users = await User.findAll()
            if (req.query.username) {
                const newUsers = users.filter(u => u.username.toLowerCase().includes(req.query.username.toLowerCase()))
                return res.status(200).json(newUsers)
            }
            return res.status(200).json(users)
        } catch (error) {
            res.status(500).error(error)
        }
    },
    currentUser: async (req, res) => {
        try {
            const user = await User.findByPk(req.data.id)
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    },
    getOrCreate: async (req, res) => {
        try {
            const user = await User.findOne({ where: { username: req.body.username } })
            if (user) {
                return res.status(200).json(user)
            }
            const newUser = await User.create({
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                role: "USER",
                avatar: req.body.avatar
            })
            res.status(200).json(newUser)
        } catch (error) {
            console.log(error)
        }
    },
    googleLogin: async (req, res) => {
        try {
            const user = await User.findOne({ where: { username: req.body.username } })
            const emai = req.body.email
            if (user.username === emai) {
                const accessToken = await jwt.sign({
                    id: user.id,
                }, process.env.SECRET_KEY)

                res.status(200).json({ accessToken, user })

            }
        } catch (error) {
            console.log(error)
        }
    },
    lock: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.userId)
            if (user.active === 0) {
                user.active = 1
                user.save()
                return res.status(200).json("Success")
            }
            if (user.active === 1) {
                user.active = 0
                user.save()
                return res.status(200).json("Success")
            }

        } catch (error) {
            console.log(error)
        }
    },
    getOne: async (req, res) => {
        try {
            const user = await User.findByPk(req.params.userId)
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const user = await User.findOne({ where: { username: req.body.username } })
            const validPassword = await bcrypt.compare(user.password, req.body.password)
            if (user && validPassword) {
                if (user.role === "ADMIN") {
                    const accessToken = jwt.sign({
                        id: user.id
                    }, process.env.SECRET_KEY)
                    return res.status(200).json({ accessToken, user })

                } else {
                    return res.status(500).json("User is not admin")
                }
            }
            return res.status(500).json("Error")
        } catch (error) {
            console.log(error)
        }
    },
    countAllUser: async (req, res) => {
        try {
            const [[count]] = await sequelize.query(`select count(*) as 'countUser' from users`)
            res.status(200).json(count)
        } catch (error) {
            console.log(error)
        }
    },
    forgetPassWord: async (req, res) => {
        try {
            const user = await User.findOne({ where: { username: req.body.username } })
            if (user) {
                const otp = OTP.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

                let info = await transporter.sendMail({
                    from: "nguyenducduc2441@gmail.com", // sender address
                    to: user.email, // list of receivers
                    subject: "Spending managerment notification", // Subject line
                    html: `<p>Mã OTP để đặt lại mật khẩu là: <b>${otp}</b></p>`
                })
                return res.status(200).json({ "OTP": otp, user })
            }else {
                return res.status(400).json("Tài khoản không tồn tại!")
            }

        } catch (error) {
            console.log(error)
        }
    },
    resetPassword: async (req,res) => {
        try {
            const user = await User.findByPk(req.body.userId)
            const salt = await bcrypt.genSalt(10)
            const hashed = await bcrypt.hash(req.body.password, salt)
            user.password = hashed
            user.save()
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { userController }