const { SpendingGroup, sequelize, User } = require("../models")

const spendingGroupController = {
    add: async (req, res) => {
        try {
            const newSpendingGroup = await SpendingGroup.create({
                money: req.body.money,
                purpose: req.body.purpose,
                user_id: req.body.user_id,
                group_id: req.body.group_id
            })
            res.status(201).json(newSpendingGroup)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getByUserId: async (req, res) => {
        try {
            const spendingGroups = await SpendingGroup.findAll({ where: { user_id: req.params.userId } })
            res.status(200).json(spendingGroups)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    update: async (req, res) => {
        try {
            const spendingGroup = await SpendingGroup.findByPk(req.params.id)
            if (spendingGroup) {
                if (req.body.money) {
                    spendingGroup.money = req.body.money
                }
                if (req.body.purpose) {
                    spendingGroup.purpose = req.body.purpose
                }
                await spendingGroup.save()
                res.status(200).json(spendingGroup)
            }
        } catch (error) {
            res.status(500).json(error)
        }
    },
    delete: async (req, res) => {
        try {
            const spendingGroup = await SpendingGroup.findByPk(req.params.id)
            await spendingGroup.destroy()
            res.status(200).json("Delete success")
        } catch (error) {
            res.status(500).json(error)
        }
    },
    detailSpending: async (req, res) => {
        try {
            const [totalSpending] = await sequelize.query(`select sum(money) as 'totalSpending' from spendinggroups where group_id=${req.params.groupId}`)
            const [countUser] = await sequelize.query(`select count(user_id) as 'countUser' from belongtos where group_id=${req.params.groupId} `)
            const [userSpending] = await sequelize.query(`select user_id, sum(money) as 'totalSpending' from spendinggroups where group_id=${req.params.groupId} group by user_id`)
            const [userMember] = await sequelize.query(`select user_id from belongtos where group_id=${req.params.groupId}`)
            const moneyUserSpendingGroup = []
            // ep kieu thanh so thuc
            for (let i = 0; i < userSpending.length; i++) {
                userSpending[i].totalSpending = parseFloat(userSpending[i].totalSpending)
                
            }
            const total = parseFloat(totalSpending[0].totalSpending)
            const count = parseInt(countUser[0].countUser)
            const userMustPay = total / count
            // duyet tung thanh vien trong belongto de lay ra user id va tinh chi tieu cua user do
            for (let i = 0; i < userMember.length; i++) {
                // voi tung user id se thuc thi cau lenh SQL de lay ra tong so tien cua user id do
                const [[ts]] = await sequelize.query(`select sum(money) as 'totalSpending' from spendinggroups where user_id=${userMember[i].user_id} and group_id=${req.params.groupId}`)
                if (ts.totalSpending === null) {
                    ts.totalSpending = 0
                }
                // tao object de chua user id va so tien user do da chi vao nhom
                const us = await User.findByPk(userMember[i].user_id)
                const newObj = {
                    user_id: userMember[i].user_id,
                    user: us,
                    totalSpending: parseFloat(ts.totalSpending)
                }
                if (newObj.totalSpending < userMustPay) {
                    newObj.payMore = userMustPay - newObj.totalSpending

                } else {
                    newObj.refund = newObj.totalSpending - userMustPay
                    newObj.isRefund = true

                }
                moneyUserSpendingGroup.push(newObj)
            }


            const resDetail = {
                total: total,
                count: count,
                userMustPay: userMustPay,
                users: moneyUserSpendingGroup,
                flow: []
            }

            // tinh toan xem ai phai tra lai ai
            let arrUserPay = []
            let arrUserRefund = []
            for (let i = 0; i < resDetail.users.length; i++) {
                // luu user id vao mang user phai tra them thien
                if (resDetail.users[i].payMore) {
                    arrUserPay.push(resDetail.users[i])
                    //[
                    //   { user_id: 2, totalSpending: 0, payMore: 552547 },
                    //   { user_id: 3, totalSpending: 0, payMore: 552547 }
                    //]
                }
                // luu user id va mang user duoc hoan tien
                if (resDetail.users[i].refund) {
                    arrUserRefund.push(resDetail.users[i])
                }
            }


            // test
            for (let i = 0; i < arrUserPay.length; i++) {
                let currentMoney = arrUserPay[i].payMore
                
                for (let j = 0; j < arrUserRefund.length; j++) {
                    //[2, 3] arrUserPay
                    //[1, 4]    arrUserRefund
                    // bien isRefund dung de kiem tra xem user do con trang thai nhan tien hay khong.
                    if(arrUserRefund[j].isRefund){
                        if (currentMoney > arrUserRefund[j].refund) {
                            console.log(`${arrUserPay[i].user_id} tra ${arrUserRefund[j].user_id} = ${arrUserRefund[j].refund}`)
                            //add vao resDetail
                            const userFrom = await User.findByPk(arrUserPay[i].user_id)
                            const userTo = await User.findByPk(arrUserRefund[j].user_id)
                            resDetail.flow.push({
                                "from": userFrom,
                                "to": userTo,
                                "money": arrUserRefund[j].refund
                            })
                            // cap nhat lai refund
                            
                            currentMoney = currentMoney - arrUserRefund[j].refund
                            arrUserRefund[j].isRefund = false
                            continue
                        }
                        if ( currentMoney > 0 && currentMoney <= arrUserRefund[j].refund) {
                            console.log(`${arrUserPay[i].user_id} tra ${arrUserRefund[j].user_id} = ${currentMoney}`)
                            const userFrom = await User.findByPk(arrUserPay[i].user_id)
                            const userTo = await User.findByPk(arrUserRefund[j].user_id)
                            resDetail.flow.push({
                                "from": userFrom,
                                "to": userTo,
                                "money": currentMoney
                            })
                            // update tien refund
                            arrUserRefund[j].refund = arrUserRefund[j].refund - currentMoney
                            // update tien 
                            currentMoney = currentMoney - arrUserRefund[j].refund
                            
                            break
                        }
                        
                    }
                    
                    
                    
                }
            }
            res.status(200).json(resDetail)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { spendingGroupController }