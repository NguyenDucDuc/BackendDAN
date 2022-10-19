const {TempSpendingGroup, User} = require("../models")


const tempSpendingGroupController = {
    add: async (req,res) => {
        try {
            const newTempSpendingGroup = await TempSpendingGroup.create({
                user_id: req.data.id,
                group_id: req.body.group_id,
                money: req.body.money,
                purpose: req.body.purpose
            })
            const user = await User.findByPk(newTempSpendingGroup.user_id)
            newTempSpendingGroup.user_id=user
            setTimeout( () => {
                res.status(201).json(newTempSpendingGroup)
            },1000)
            
        } catch (error) {
            console.log(error)
        }
    },
    getByGroup: async(req,res) => {
        try {
            const tempSpendingGroups = await TempSpendingGroup.findAll({where: {group_id: req.params.groupId}})
            for(let i=0; i<tempSpendingGroups.length; i++){
                const user = await User.findByPk(tempSpendingGroups[i].user_id)
                tempSpendingGroups[i].user_id = user
            }
            res.status(200).json(tempSpendingGroups)
        } catch (error) {
            console.log(error)
        }
    },
    delete: async (req,res) => {
        try {
            const tempSpendingGroup = await TempSpendingGroup.findByPk(req.params.tempSpendingGroupId)
            const groupId = tempSpendingGroup.group_id
            await tempSpendingGroup.destroy()
            const tempSpendingGroups = await TempSpendingGroup.findAll({where: {group_id: groupId}})
            for(let i=0; i<tempSpendingGroups.length; i++){
                const user = await User.findByPk(tempSpendingGroups[i].user_id)
                tempSpendingGroups[i].user_id = user
            }
            res.status(200).json(tempSpendingGroups)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {tempSpendingGroupController}