const mongoose = require('mongoose');
const Chat = require('./models/chat.js');


main()
.then(() => {
    console.log("Database formed");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChats = [
    {
        from: "neha",
        to: "priya",
        msg: "send me your exam sheet",
        created_at: new Date()
    },
    {
        from: "rahul",
        to: "priya",
        msg: "send me your exam sheet A",
        created_at: new Date()
    },
    {
        from: "priya",
        to: "neha",
        msg: "send exam sheet",
        created_at: new Date()
    },
    {
        from: "priya",
        to: "rahul",
        msg: "send exam sheet A",
        created_at: new Date()
    },
];

Chat.insertMany(allChats);