const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat.js');
const methodOverride = require('method-override');
const ExpressError = require('./ExpressError.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


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


// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheet",
//     created_at: new Date()
// });

// chat1.save()
// .then((res) => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log(err);
// });

app.get("/", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
});

// Index Route

app.get("/chats", asyncWrap(async (req, res) => {
    
        let chats = await Chat.find();
        res.render("index.ejs", {chats});
}));

// New user Route
app.get("/chats/new", (req, res) => {
    // throw new ExpressError (404, "Page not found!");
    res.render("new.ejs");
});

// Create route

app.post("/chats", asyncWrap(async (req, res, next) => {
   
        let { from, msg, to } = req.body;
        let newChat = Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
    
}));

// to handle to error 
// remove try and catch also for optimize the code 
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    }
}

// New - Show Route

app.get("/chats/:id", asyncWrap(async (req, res, next) => {
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if (!chat) {
            next(new ExpressError (404, "Chat not Found!"));
    }
    res.render("edit.ejs", {chat});
}));

// Edit Route

app.get("/chats/:id/edit", async (req, res) => {
    try {
        let {id} = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", {chat});
    } catch (err) {
        next(err);
    }
});

// Update Route
app.put("/chats/:id", async (req, res) => {
    try {
        let {id} = req.params;
        let {msg: newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, {runValidators: true, new: true},);
        console.log(updatedChat);
        res.redirect("/chats");
    } catch (err) {
        next(err);
    }
});

// Delete Route
app.delete("/chats/:id", async (req, res) => {
    try {
        let {id} = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
    } catch(err) {
        next(err);
    }
});

// Print Error name

app.use((err, req, res, next) => {
    console.log(err.name);
    next(err);
});

// Error Handling Middleware

app.use((err, req, res, next) => {
    let {status=500, message="Some Error Occurred!"} = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("App start listen Port : 8080");
});