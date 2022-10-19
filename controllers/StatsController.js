const {User, IncomeSpending, Group, sequelize} = require("../models")


const statsController = {
    totalIncome: async(req,res) => {
        try {
            const user = await User.findByPk(req.params.userId)
            const [totalIncome] = await sequelize.query(`select sum(money) as 'totalIncome' from incomespendings where user_id=${user.id} and type="INCOME"`)
            res.status(200).json({user, totalIncome})
        } catch (error) {
            console.log(error)
        }
    },
    totalSpending: async(req,res) => {
        try {
            const user = await User.findByPk(req.params.userId)
            const [totalSpending] = await sequelize.query(`select sum(money) as 'totalIncome' from incomespendings where user_id=${user.id} and type="SPENDING"`)
            res.status(200).json({user, totalSpending})
        } catch (error) {
            console.log(error)
        }
    },
    total: async (req,res) => {
        try {
            let queryTotalIncome = `select sum(money) as 'totalIncome' from incomespendings where user_id=${req.data.id} and type="INCOME" `
            let queryTotalSpending = `select sum(money) as 'totalSpending' from incomespendings where user_id=${req.data.id} and type="SPENDING" `
            

            if(req.query.fromDate && req.query.toDate){
                const fromDate = req.query.fromDate
                const toDate = req.query.toDate
                queryTotalIncome+=`and Date(createdAt) >= "${fromDate}" and Date(createdAt) <= "${toDate} `
                queryTotalSpending += `and Date(createdAt) >= "${fromDate}" and Date(createdAt) <= "${toDate}" `
            } else {
                if(req.query.fromDate){
                    const fromDate = req.query.fromDate
                    queryTotalIncome+=`and Date(createdAt) = "${fromDate}" `
                    queryTotalSpending+=`and Date(createdAt) = "${fromDate}" `
                }
                if(req.query.toDate){
                    const toDate = req.query.toDate
                    queryTotalIncome += `and Date(createdAt) = "${toDate}" `
                    queryTotalSpending += `and Date(createdAt) = "${toDate}" `
                }
            }
            
            const [[totalIncome]] = await sequelize.query(queryTotalIncome)
            const [[totalSpending]] = await sequelize.query(queryTotalSpending)
            const resTotal = {
                totalIncome: parseFloat(totalIncome.totalIncome),
                totalSpending: parseFloat(totalSpending.totalSpending)
            }
            res.status(200).json(resTotal)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {statsController}