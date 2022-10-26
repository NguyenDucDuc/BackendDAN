const { Warning, sequelize, User } = require("../models")
const nodemailer = require('nodemailer')

//NODE MAILER
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nguyenducduc2441@gmail.com", // generated ethereal user
        pass: "yeaaexhzluzpzgxq", // generated ethereal password
    },
});


const warningController = {
    add: async (req, res) => {
        try {
            const warning = await Warning.findOne({
                where: {
                    content: req.body.content,
                    user_id: req.data.id
                }
            })
            if (warning) {
                return res.status(500).json("Cảnh báo đã tồn tại")
            } else {
                const newWarning = await Warning.create({
                    content: req.body.content,
                    user_id: req.data.id
                })
                const user = await User.findByPk(req.data.id)

                // Gui thong bao ve email
                let info = await transporter.sendMail({
                    from: "nguyenducduc2441@gmail.com", // sender address
                    to: user.email, // list of receivers
                    subject: "Spending managerment notification", // Subject line
                    html: `<b>${newWarning.content}</b>`
                })
                res.status(201).json(newWarning)
            }

        } catch (error) {
            console.log(error)
            if (error.code === 'ER_DUP_ENTRY') {

            }
        }
    },
    getAll: async (req, res) => {
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
    count: async (req, res) => {
        try {
            const [count] = await sequelize.query(`select count(*) as 'count' from warnings where user_id=${req.data.id}`)
            res.status(200).json(count)
        } catch (error) {
            console.log(error)
        }
    },
    deleteByContent: async (req, res) => {
        try {
            const [[warning]] = await sequelize.query(`select * from warnings where content = 'Thu nhập của bạn đang ít hơn chi tiêu' and user_id=${req.data.id}`)
            await sequelize.query(`delete from warnings where content = 'Thu nhập của bạn đang ít hơn chi tiêu' and user_id=${req.data.id} `)
            res.status(200).json(warning)
        } catch (error) {
            console.log(error);
        }
    },
    getOne: async (req, res) => {
        try {
            const warning = await Warning.findOne({
                where: {
                    content: req.body.content,
                    user_id: req.data.id
                }
            })
            res.status(200).json(warning)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { warningController }

