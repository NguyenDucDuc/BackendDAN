const {Warning, sequelize} = require("../models")

const warningController = {
    add: async (req,res) => {
        try {
            const newWarning = await Warning.create({
                content: req.body.content,
                user_id: req.data.id
            })
            res.status(201).json(newWarning)
        } catch (error) {
            console.log(error)
        }
    },
    getAll: async(req,res) => {
        try {
            const [warnings] = await sequelize.query(`select *
            from warnings
            where user_id = ${req.data.id} 
            order by id DESC`)
            res.status(200).json(warnings)
        } catch (error) {
            console.log(error)
        }
    },
    count: async(req,res) => {
        try {
            const [count] = await sequelize.query(`select count(*) as 'count' from warnings where user_id=${req.data.id}`)
            res.status(200).json(count)
        } catch (error) {
            console.log(error)
        }
    },
    deleteByContent: async(req, res) => {
        try {
            const [[warning]] = await sequelize.query(`select * from warnings where content = 'Thu nhập của bạn đang ít hơn chi tiêu' and user_id=${req.data.id}`)
            await sequelize.query(`delete from warnings where content = 'Thu nhập của bạn đang ít hơn chi tiêu' and user_id=${req.data.id} `)
            res.status(200).json(warning)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {warningController}

