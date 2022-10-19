const { MessageGroup } = require("../modelMongoDB/MessageGroup")
const {User} = require("../models")



const messageGroupController = {
    add: async(req,res) => {
        try {
            const newMessageGroup = await MessageGroup.create({
                userId: req.body.user_id,
                groupId: req.body.group_id,
                content: req.body.content
            })
            await newMessageGroup.save()
            const user = await User.findByPk(newMessageGroup.userId)
            newMessageGroup.userId = user
            res.status(200).json(newMessageGroup)
        } catch (error) {
            console.log(error)
        }
    },
    getAll: async (req,res) => {
        try {
            const messageGroups = await MessageGroup.find({groupId: parseInt(req.params.groupId)})
            for(let i=0; i<messageGroups.length; i++){
                const user = await User.findByPk(messageGroups[i].userId)
                messageGroups[i].userId = user
            }
            // console.log(messageGroups)
            setTimeout( () => {
                res.status(200).json(messageGroups)
            },1000)
            
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {messageGroupController}