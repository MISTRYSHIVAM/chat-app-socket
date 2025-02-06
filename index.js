import { Server } from "socket.io";

const io = new Server({ cors: 'http://localhost:5555/' });

let users = [];
function addUser(user, socketId) {
    !users.some((u) => user.id === u.user.id) && users.push({ user, socketId });
    // console.log(users.user)
}

function removeUser(socketId) {
    users = users.filter((user) => user.socketId !== socketId);
}

function getOnlineUser() {
    return users;
}
function getUsers() {
    console.log(users);
}
function findUser(userId) {
    return users.find((u) => u.user.id == userId)?.socketId;
}
// getUsers()
io.on("connection", (socket) => {

    try {


        // console.log(socket.id);
        console.log("Connected!....");
        // getUsers()
        // console.log(socket)
        // send message to all conneted client
        // setInterval(() => {
        //     socket.emit('notification', "Hello from server");
        // }, 2000);

        // socket.emit('welcome',{message : })
        socket.emit('notification', "Hello from server");

        socket.on('messageToServer', (msg) => {
            console.log(msg)
        })

        socket.on('addUser', (user) => {
            // console.log("adding user : ")
            addUser(user, socket.id);
            // getUsers();
        })
        setInterval(() => {
            socket.emit('onlineUser', getOnlineUser());
        }, 10000)

        socket.on("disconnect", (socket) => {
            // console.log(socket)
            console.log("Disconnected!....");
            removeUser(socket.id)
            // getUsers();
        })
        // after connection take userId and socketId and store
        socket.on("privateMessage", (messageData) => {
            // console.log(messageData);
            let receiverSocketId = findUser(messageData.sendTo._id);
            // console.log(receiverSocketId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", messageData);
            }
            // io.to(socketId).emit("receiveMessage", message)
        })

    } catch (err) {
        console.log(err)
    }
})

io.listen(5555);