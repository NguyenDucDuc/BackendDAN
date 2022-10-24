const {Group, User, BelongTo, sequelize} = require("../models")
const {validationResult} = require("express-validator")

const groupController = {
    add: async (req,res) => {
        const err = validationResult(req)
        if(!err.isEmpty()){
            return res.status(400).json(err.array())
        }
        try {
            const newGroup = await Group.create({
                groupname: req.body.groupname,
                purpose: req.body.purpose,
                user_id: req.data.id
            })
            res.status(201).json(newGroup)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    
    getGroupByUser: async(req,res) => {
        try {
            let query = `select * from quanlychitieudb.groups where user_id=${req.data.id}`
            if(req.query.page){
                const page = parseInt(req.query.page)
                query += ` limit ${5} offset ${(page-1)*5}`
            }
            const [groups] = await sequelize.query(query)
            res.status(200).json(groups)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getDetail: async(req,res) => {
        try {
            const group = await Group.findByPk(req.params.id)
            const user = await User.findByPk(group.user_id)
            const groupDetail = {
                id: group.id,
                groupname: group.groupname,
                purpose: group.purpose,
                user: user,
                createdAt: group.createdAt,
                updatedAt: group.updatedAt
            }
            res.status(200).json(groupDetail)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    update: async(req,res) => {
        try {
            const group = await Group.findByPk(req.params.id)
            if(req.body.groupname != null){
                group.groupname = req.body.groupname
            }
            if(req.body.purpose != null){
                group.purpose = req.body.purpose
            }
            await group.save()
            res.status(200).json(group)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    delete: async(req,res) => {
        try {
            const group = await Group.findByPk(req.params.id)
            await group.destroy()
            const groups = await Group.findAll({where: {user_id: req.data.id}})
            res.status(200).json(groups)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    addMember: async (req,res) => {
        try {
            const newBelongTo = await BelongTo.create({
                user_id: req.body.user_id,
                group_id: req.body.group_id
            })
            const belongTos = await BelongTo.findAll({where: {group_id: req.params.groupId}})
            for(let i=0; i< belongTos.length; i++) {
                const user = await User.findByPk(belongTos[i].user_id)
                belongTos[i].user_id = user
            }
            res.status(200).json(belongTos)
            
        } catch (error) {
            console.log(error)
            res.status(500).json("GroupId and UserId is already exist")
        }
    },
    countAllGroupByUser: async (req,res) => {
        try {
            const [[count]] = await sequelize.query(`select count(*) as 'count' from quanlychitieudb.groups where user_id=${req.data.id}`)
            res.status(200).json(count)
        } catch (error) {
            console.log(error)
        }
    }
    
    
}


module.exports = {groupController}