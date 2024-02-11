const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

io.on("connection", (socket) => {
    //when ceonnect
    console.log(`User online.`);

    //take userId and socketId from user
    socket.on("add_user", (email) => {
        addUser(email, socket.id);
        socket.join(socket.id);
        console.log(users);
        //   io.emit("getUsers", users);
    });

    //send and get message
    socket.on("send_message", ({ senderId, receiverId, text, type }) => {
        const user = getUser(receiverId);
        // io.to(user.socketId).emit("receive_message", { senderId, text });
        io.emit("receive_message", { senderId, receiverId, text, type });

    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log(`a user disconnected!`);
        removeUser(socket.id);
        //   io.emit("getUsers", users);
    });
});

const addUser = (email, socketId) => {
    !users.some((user) => user.email === email) &&
        users.push({ email, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (email) => {
    return users.find((user) => user.email === email);
};


// fs.readFileSync('socketData.json', (err, data) => {
//     if (err) throw err;
//     let available_users = JSON.parse(data);
//     console.log(available_users);
//     let actual_users = [];
//     actual_users = available_users.filter(available => available.email === email);
//     // if(available_users.length > 0){
//     // }
//     actual_users.push({ email: email, id: socket.id })
//     console.log(actual_users);
//     fs.appendFileSync('socketData.json', JSON.stringify(actual_users), function (err) {
//         if (err) throw err;
//     });

//     socket.on("disconnect", () => {
//         console.log(`${socket.id} disconnected`);
//     })
// });


// fs.writeFileSync('socketData.json', JSON.stringify([{ email: "", id: '########' }]), function (err) {
//     if (err) throw err;
// });


// await io.getIO().to(recepient).emit('message', {
//     action: 'create',
//     message: message
// });