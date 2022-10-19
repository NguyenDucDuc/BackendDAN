const {BelongTo, User, Group} = require("../models")


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
            const belongTo = await BelongTo.findByPk(req.params.belongToId)
            const groupId = belongTo.group_id
            await belongTo.destroy()
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
            const belongTos = await BelongTo.findAll({where: {user_id: req.data.id}})
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