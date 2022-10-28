const express = require("express")
const fileupload = require("express-fileupload")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const moragn = require("morgan")
const nodemon = require("nodemon")

const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")

const { userRoute } = require("./routes/UserRoute")
const dotenv = require("dotenv")
const { incomeSpendingRoute } = require("./routes/IncomeSpendingRoute")
const { groupRoute } = require("./routes/GroupRoute")
const { spendingGroupRoute } = require("./routes/SpendingGroupRoute")
const { statsRoute } = require("./routes/StatsRoute")
const { warningRoute } = require("./routes/WarningRoute")
const { belongToRoute } = require("./routes/BelongToRoute")
const { tempSpendingGroupRoute } = require("./routes/TempSpendingGroupRoute")
const mongoose = require("mongoose")
const { messageGroupRoute } = require("./routes/MessageGroupRoute")
const { userGoogleRoute } = require("./routes/UserGoogleRoute")
dotenv.config()


//connect mongoDB
mongoose.connect("mongodb://localhost:27017/MessageDB", () => {
    console.log("mongoDB connected")
})

//NEW SOCKET
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})




app.use(bodyParser.json())
app.use(moragn("combined"))
app.use(cors())
app.use(fileupload({
    useTempFiles: true
}))

//ROUTES

app.use("/api/v1", userRoute)
app.use("/api/v1", incomeSpendingRoute)
app.use("/api/v1", groupRoute)
app.use("/api/v1", spendingGroupRoute)
app.use("/api/v1", statsRoute)
app.use("/api/v1", warningRoute)
app.use("/api/v1", belongToRoute)
app.use("/api/v1", tempSpendingGroupRoute)
app.use("/api/v1", messageGroupRoute)
app.use('/api/v1', userGoogleRoute)


//SOCKET
let userConnect = []
io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on('disconnect', () => {
        userConnect = userConnect.filter(u => u.socketId !== socket.id)
    })
    socket.on('login', userId => {
        // kiem tra xem user cos trong mang chua, neu chua thi them vao
        userConnect.push({
            userId: userId,
            socketId: socket.id,
        })
        console.log(userConnect)

    })
    socket.on("joinRoom", roomId => {
        socket.join(roomId)
        socket.roomId = roomId
    })
    socket.on("test", (data) => {
        console.log(data)
    })
    socket.on("clientSendWarning", (data) => {
        console.log(data)
    })

    socket.on("clientSendSpending", (spending) => {
        console.log(spending)
        socket.broadcast.emit("serverReSendSpending", spending)
    })

    socket.on("clientSendMessage", data => {
        // io.sockets.emit("serverReSendMessage", data)
        console.log(data.userId)
        io.sockets.emit("serverReSendMessage", data)
    })
    socket.on("clientSendGroup", data => {
        socket.broadcast.emit("serverReSendGroup", data)
    })

    socket.on("clientSendGroupDeleted", data => {
        socket.broadcast.emit("clientReSendGroupDeleted", data)
    })

    socket.on("infoClientTyping", info => {
        socket.broadcast.emit("serverReSendInfoClientTyping", info)
    })

    socket.on("clientSendTypingOff", userNull => {
        socket.broadcast.emit("serverReSendTypingOff", userNull)
    })

    socket.on("clientSendIncomeSpending", data => {
        console.log(data)
        // socket.broadcast.emit("serverReSendIncomeSpending", data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendIncomeSpending', data.incomeSpending)
        }
    })

    socket.on("clientSendWarning", data => {
        // socket.broadcast.emit("serverReSendWarning", data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendWarning', data.warning)
        }
    })

    socket.on("clientSendSpendingJar", data => {
        socket.broadcast.emit("serverReSendSpendingJar", data)
    })
    socket.on("clientSendIncomeSpendingAfterDelete", data => {
        // socket.broadcast.emit("serverReSendIncomeSpendingAfterDelete", data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendIncomeSpendingAfterDelete', data.incomeSpending)
        }
    })
    socket.on("clientSendGroupAfterDeleted", data => {
        // socket.broadcast.emit("serverReSendGroupAfterDeleted", data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendGroupAfterDeleted', data.groups)
        }
    })
    socket.on("clientSendCreateGroup", data => {
        // socket.broadcast.emit("serverReSendCreateGroup", data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendCreateGroup', data.group)
        }
    })
    socket.on('clientSendCreateBelongTo', data => {
        // socket.broadcast.emit('serverReSendCreateBelongTo', data)
        const receiver = userConnect.filter(u => u.userId === data.userId)
        for(i=0; i<receiver.length; i++){
            io.to(receiver[i].socketId).emit('serverReSendCreateBelongTo', data.belongTo)
        }
    })
})


const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log("server is running...")
})