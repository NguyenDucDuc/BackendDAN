const { IncomeSpending, User, Sequelize, sequelize } = require("../models")
const nodemailer = require("nodemailer")
const { validationResult } = require("express-validator")


//NODE MAILER
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nguyenducduc2441@gmail.com", // generated ethereal user
        pass: "yeaaexhzluzpzgxq", // generated ethereal password
    },
});



const incomeSpendingController = {
    add: async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return res.status(400).json(err.array())
        }
        try {
            const newIncomeSpending = await IncomeSpending.create({
                money: req.body.money,
                purpose: req.body.purpose,
                type: req.body.type,
                user_id: req.data.id
            })
            const user = await User.findByPk(req.data.id)
            // let info = await transporter.sendMail({
            //     from: "nguyenducduc2441@gmail.com", // sender address
            //     to: user.email, // list of receivers
            //     subject: "Spending managerment notification", // Subject line
            //     text: `${newIncomeSpending.type === "INCOME" ? `Thu nhập của bạn vừa tăng ${newIncomeSpending.money} VND từ việc ${newIncomeSpending.purpose}` :
            //         `Bạn vừa chi tiêu ${newIncomeSpending.money} VND cho việc ${newIncomeSpending.purpose}`
            //         }`
            // })
            setTimeout(() => {
                res.status(201).json(newIncomeSpending)
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    },
    getAll: async (req, res) => {
        try {
            const incomeSpendings = await IncomeSpending.findAll()
            res.status(200).json(incomeSpendings)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getDetail: async (req, res) => {
        try {
            const incomeSpending = await IncomeSpending.findByPk(req.params.id)
            const user = await User.findByPk(incomeSpending.user_id)
            const incomeSpendingDetail = {
                id: incomeSpending.id,
                money: incomeSpending.money,
                purpose: incomeSpending.purpose,
                type: incomeSpending.type,
                user: user,
                createdAt: incomeSpending.createdAt,
                updatedAt: incomeSpending.updatedAt
            }

            res.status(200).json(incomeSpendingDetail)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    delete: async (req, res) => {
        try {
            const incomeSpending = await IncomeSpending.findByPk(req.params.id)
            await incomeSpending.destroy()
            let query = `select * from incomespendings where user_id=${req.data.id}`
            if (req.query.type) {
                query += ` and type="${req.query.type}"`
            }
            // const incomeSpendings = await IncomeSpending.findAll({ where: { user_id: req.data.id } })
            const [incomeSpendings] = await sequelize.query(query)
            res.status(200).json(incomeSpendings)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    update: async (req, res) => {
        try {
            const incomeSpending = await IncomeSpending.findByPk(req.params.id)
            if (req.body.money != null)
                incomeSpending.money = req.body.money
            if (req.body.purpose != null)
                incomeSpending.purpose = req.body.purpose
            incomeSpending.save()
            res.status(200).json(incomeSpending)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getByUser: async (req, res) => {
        try {
            // cong thuc phan trang: (page - 1) * pageSize
            let query = `select * from incomespendings where user_id=${req.data.id} `

            if (req.query.fromDate) {
                const fromDate = req.query.fromDate
                query += `and DATE(createdAt) >= "${fromDate}" `
            }

            if (req.query.toDate) {
                const toDate = req.query.toDate
                query += `and Date(createdAt) <= "${toDate}" `
            }

            if (req.query.type) {
                const type = req.query.type
                query += `and type="${type}" `
            }

            if (req.query.pageSize) {
                const pageSize = req.query.pageSize
                const page = req.query.page // luon luon truyen page vao endpoint
                query += `limit ${pageSize} offset ${(page - 1) * pageSize} `
            }
            const [incomeSpendings] = await sequelize.query(query)

            res.status(200).json(incomeSpendings)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    count: async (req, res) => {
        try {
            let query = `select count(user_id) as 'Count' from incomespendings where user_id=${req.data.id} `
            if (req.query.fromDate) {
                const fromDate = req.query.fromDate
                query += `and DATE(createdAt) >= "${fromDate}" `
            }

            if (req.query.toDate) {
                const toDate = req.query.toDate
                query += ` and Date(createdAt) <= "${toDate}" `
            }
            if (req.query.type) {
                const type = req.query.type
                query += `and type="${type}" `
            }
            const [count] = await sequelize.query(query)
            res.status(200).json(count)
        } catch (error) {
            console.log(error)
        }
    },
    total: async (req, res) => {
        try {

            const [totalIncome] = await sequelize.query(`select sum(money) as 'totalIncome' from incomespendings where user_id=${req.data.id} and type='INCOME'`)
            const [totalSpending] = await sequelize.query(`select sum(money) as 'totalSpending' from incomespendings where user_id=${req.data.id} and type='SPENDING'`)
            const a = totalIncome[0].totalIncome
            const b = totalSpending[0].totalSpending
            const resTotal = {
                "totalIncome": parseFloat(a),
                "totalSpending": parseFloat(b)
            }

            res.status(200).json(resTotal)
        } catch (error) {
            console.log(error)
        }
    },
    countSpending: async (req, res) => {
        try {
            const [countSpendingDay] = await sequelize.query(`select count(*) as 'countSpendingDay' from incomespendings where user_id=${req.data.id} and Date(createdAt) = Date(Now()) `)
            res.status(200).json(countSpendingDay)
        } catch (error) {
            console.log(error)
        }
    },
    totalIncomeMonth: async (req, res) => {
        try {
            const [totalIncomeMonth] = await sequelize.query(`select sum(money) as 'totalIncomeMonth' from incomespendings where user_id=${req.data.id} and Month(createdAt) = Month(Now()) and type='INCOME'`)
            const [totalSpendingMonth] = await sequelize.query(`select sum(money) as 'totalSpendingMonth' from incomespendings where user_id=${req.data.id} and Month(createdAt) = Month(Now()) and type='SPENDING'`)
            const resTotal = {
                totalIncomeMonth: parseInt(totalIncomeMonth[0].totalIncomeMonth),
                totalSpendingMonth: parseInt(totalSpendingMonth[0].totalSpendingMonth)
            }
            res.status(200).json(resTotal)
        } catch (error) {
            console.log(error)
        }
    },
    addWithJar: async (req, res) => {
        try {
            const newIncome = await IncomeSpending.create({
                money: req.body.money,
                purpose: req.body.purpose,
                type: "SPENDING",
                jar: req.body.jar,
                user_id: req.data.id
            })
            setTimeout(() => {
                res.status(200).json(newIncome)
            }, 1000)

        } catch (error) {
            console.log(error)
        }
    },
    getWithJar: async (req, res) => {
        try {
            let query = `select * from incomeSpendings where user_id=${req.data.id} and type="${"SPENDING"}" and jar is NOT NULL `
            if (req.query.jar) {
                query += `and jar="${req.query.jar}" `
            }
            if (req.query.page && req.query.pageSize) {
                const page = req.query.page
                const pageSize = req.query.pageSize
                query += `limit ${pageSize} offset ${(req.query.page - 1) * pageSize}`
            }
            const [spendingJar] = await sequelize.query(query)
            res.status(200).json(spendingJar)
        } catch (error) {
            console.log(error)
        }
    },
    countSpendingJar: async (req, res) => {
        try {
            let countQuery = `select count(*) as 'countSpendingJar' from incomeSpendings where user_id=${req.data.id} and type="${"SPENDING"}" and jar is NOT NULL `
            if (req.query.jar) {
                countQuery += `and jar="${req.query.jar}"`
            }
            const [[countSpendingJar]] = await sequelize.query(countQuery)
            res.status(200).json(countSpendingJar)
        } catch (error) {
            console.log(error)
        }
    },
    calcPercent: async (req, res) => {
        try {
            const [[totalSpendingJar]] = await sequelize.query(`select sum(money) as 'total' from incomespendings where user_id=${req.data.id} and jar IS NOT NULL`)
            totalSpendingJar.total = parseFloat(totalSpendingJar.total)
            const [jarPercent] = await sequelize.query(`select jar,CAST((sum(money) / ${totalSpendingJar.total} * 100) as FLOAT) as 'total' from incomespendings where user_id=${req.data.id} and jar IS NOT NULL GROUP BY jar ORDER BY jar`)
            const arrJar = ["NEC", "PLAY", "LTS", "EDU", "FFA", "GIVE"]
            const arrValid = []
            // them nhung phan tu co gia tri vao mang valid
            for (let i = 0; i < jarPercent.length; i++) {
                if (arrJar.indexOf(jarPercent[i].jar) !== -1) {
                    arrValid.push(jarPercent[i].jar)
                }
            }
            // lay ra cac phan tu khac nhau. De biet nhung phan tu nao chua co
            const diff = arrJar.filter(x => !arrValid.includes(x))

            for (let i = 0; i < diff.length; i++) {
                const newOjb = {
                    "jar": diff[i],
                    "total": 0
                }
                jarPercent.push(newOjb)
            }

            res.status(200).json(jarPercent)
        } catch (error) {
            console.log(error)
        }
    },
    deleteSpendingJar: async (req, res) => {
        try {
            const spendingJar = await IncomeSpending.findByPk(req.params.spendingJarId)
            await spendingJar.destroy()
            let query = `select * from incomespendings where user_id=${req.data.id} and jar IS NOT NULL`
            if (req.query.jar) {
                query += ` and jar="${req.query.jar}"`
            }
            const [spendingJars] = await sequelize.query(query)
            res.status(200).json(spendingJars)
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = { incomeSpendingController }