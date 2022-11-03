const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const { User, IncomeSpending, Group, SpendingGroup, BelongTo, TempSpendingGroup } = require("../models")
const e = require("express")

const middleWare = {
    verifyToken: (req, res, next) => {
        try {
            const token = req.headers.token
            if(!token) {
                return res.status(500).json("Bạn chưa đăng nhập, hãy đăng nhập!")
            }
            const accessToken = token.split(" ")[1]
            if (accessToken) {
                jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json("Bạn chưa đăng nhập, hãy đăng nhập!")
                    } else {
                        console.log(user)
                        req.data = user
                        console.log(req.data.id)
                        next()
                    }
                })

            } else {
                return res.status(401).json("Token is not valid")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    verifyIncomeSpending: async (req, res, next) => {
        try {
            const currentUser = await User.findByPk(req.data.id)
            const incomeSpending = await IncomeSpending.findByPk(req.params.id)

            if (currentUser && incomeSpending) {
                if (currentUser.Role === "ADMIN" || currentUser.id === incomeSpending.user_id) {
                    next()
                } else {
                    res.status(403).json("Access denied")
                }
            } else {
                res.status(403).json("Access denied")
            }
        } catch (error) {

            res.status(403).json("Access denied")

        }
    },
    verifyGroup: async (req, res, next) => {
        try {
            const currentUser = await User.findByPk(req.data.id)
            const group = await Group.findByPk(req.params.id)
            if (currentUser && group) {
                if (currentUser.role === "ADMIN" || currentUser.id == group.user_id) {
                    next()
                } else {
                    res.status(403).json("Access deniend")
                }
            } else {
                res.status(403).json("Access denied")
            }
        } catch (error) {
            res.status(403).json("Access denied")
        }
    },
    verifyAddSpendingGroup: async (req, res, next) => {
        try {
            if (req.body.group_id !== null) {
                const group = await Group.findByPk(req.body.group_id)
                if (group) {
                    next()
                } else {
                    return res.status(404).json("Bad requrest")
                }
            } else {
                return res.status(404).json("Bad request")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    verifySpendingGroup: async (req, res, next) => {
        try {
            const currentUser = await User.findByPk(req.data.id)
            const spendingGroup = await SpendingGroup.findByPk(req.params.id)
            if (currentUser && spendingGroup) {
                if (currentUser.role === "ADMIN" || currentUser.id === spendingGroup.user_id) {
                    next()
                } else {
                    return res.status(401).json("Unauthorized")
                }
            } else {
                return res.status(404).json("Bad request")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    verifyAddMember: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.data.id)
            const group = await Group.findByPk(req.body.group_id)
            if (user && user.id === group.user_id) {
                next()
            } else {
                return res.status(403).json("Access dinied")
            }
        } catch (error) {
            console.log(error)
        }
    },
    verifyDeleteMember: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.data.id)
            const belongTo = await BelongTo.findByPk(req.params.belongToId)
            const group = await Group.findByPk(belongTo.group_id)
            if (user && group.user_id === user.id && (user.id !== belongTo.user_id)) {
                next()
            } else {
                res.status(403).json("Access deniend")
            }
        } catch (error) {
            console.log(error)
        }
    },
    verifyDeleteSpendingTemp: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.data.id)
            const tempSpendingGroup = await TempSpendingGroup.findByPk(req.params.tempSpendingGroupId)
            const group = await Group.findByPk(tempSpendingGroup.group_id)
            if (user && group.user_id === user.id) {
                next()
            } else {
                return res.status(403).json("Access deniend !")
            }

        } catch (error) {
            console.log(error)
        }
    },
    verifyDeleteSpendingJar: async (req, res, next) => {
        try {
            const currentUser = await User.findByPk(req.data.id)
            const spendingJar = await IncomeSpending.findByPk(req.params.spendingJarId)
            if (currentUser && spendingJar) {
                if (currentUser.role === "ADMIN" || currentUser.id === spendingJar.user_id) {
                    next()
                } else {
                    return res.status(403).json("Access deniend!")
                }
            } else {
                return res.status(403).json("Token is not valid!")
            }
        } catch (error) {
            console.log(error)
        }
    },
    verifyLockUser: async (req, res, next) => {
        try {
            const currentUser = await User.findByPk(req.data.id)
            if(currentUser.role === "ADMIN"){
                next()
            }else {
                return res.status(403).json("Acess deniend!")
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { middleWare }