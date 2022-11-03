const {BelongTo, User, Group, sequelize} = require("../models")


const belongToController = {
    getUserByGroup: async (req,res) => {
        try {
            const belongTos = await BelongTo.findAll({where: {group_id: req.params.groupId}})
            for(let i=0; i< belongTos.length; i++) {
                const user = await User.findByPk(belongTos[i].user_id)
                belongTos[i].user_id = user
            }
            setTimeout( () => {
                res.status(200).json(belongTos)
            }, 1000)
            
        } catch (error) {
            console.log(error)
        }
    },
    deleteUserFromGroup: async (req,res) => {
        try {
            // lay ra moi quan he giua thanh vien do va nhom
            const belongTo = await BelongTo.findByPk(req.params.belongToId)
            // lay groupId
            const groupId = belongTo.group_id
            // xoa thanh vien khoi nhom
            await belongTo.destroy()
            // load lai cac thanh vien trong nhom voi groupId vua giu lai
            const belongTos = await BelongTo.findAll({where: {group_id: groupId}})
            for(let i=0; i< belongTos.length; i++) {
                const user = await User.findByPk(belongTos[i].user_id)
                belongTos[i].user_id = user
            }
            res.status(200).json(belongTos)
        } catch (error) {
            console.log(error)
        }
    },
    getGroupByUser: async (req,res) => {
        try {
            // const belongTos = await BelongTo.findAll({where: {user_id: req.data.id}})
            let query = `select * from belongtos where user_id=${req.data.id}`
            if(req.query.page){
                const page = req.query.page
                query += ` limit ${5} offset ${(page-1)*5}`
            }
            const [belongTos] = await sequelize.query(query)
            for(let i=0; i< belongTos.length; i++) {
                const group = await Group.findByPk(belongTos[i].group_id)
                belongTos[i].group_id = group
            }
            res.status(200).json(belongTos)
        } catch (error) {
            console.log(error)
        }
    },
    getGroupByUserId: async(req,res) => {
        try {
            const belongTos = await BelongTo.findAll({where: {user_id: req.params.userId}})
            for(let i=0; i< belongTos.length; i++) {
                const group = await Group.findByPk(belongTos[i].group_id)
                belongTos[i].group_id = group
            }
            res.status(200).json(belongTos)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {belongToController}