const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const uuidv4 = require('uuid/v4')
const express = require('express')
const app = express()



// var mongoose = require('mongoose'),
Timestamp = mongoose.mongo.Timestamp;

// var mongoose = require('mongoose');
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'

app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const port = process.env.PORT || 3001



const url = 'mongodb+srv://jimchou223:Jj669824@cluster0-l4bto.mongodb.net/ichat?retryWrites=true&w=majority'
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true }



// const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let dishSchema = new Schema({
    setName: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,

    },
    dishName: {
        type: String,
        required: true,
    },
    ingredient: {
        type: String,
        required: true,
    }
});

const Dish = mongoose.model('Dish', dishSchema);

mongoose.connect(url, mongooseOptions)
    .then(() => {
        console.log('database connected')
    })
    .catch((err) => {
        console.log(`Error: ${err}`)
    })



app.get('/findallsets', (req, res) => {
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("imenu");
            dbo.collection("dishes").distinct("setName", function (err, result) {
                if (err) throw err;
                res.send(result)
                db.close();
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.post('/addnewdish', (req, res) => {
    const dishObj = {
        id: uuidv4(),
        setName: req.body.setName,
        index: req.body.index,
        type: req.body.type,
        dishName: req.body.dishName,
        ingredient: req.body.ingredient
    }
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("imenu");
            dbo.collection("dishes").insertOne(dishObj, function (err) {
                if (err) {
                    res.status(400).send("Error:" + err)
                } else {
                    console.log("1 dish inserted");
                    res.send("one dish added")
                    db.close();
                }
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.post('/updatedish', (req, res) => {
    const dishObj = {
        id: req.body.id,
        setName: req.body.setName,
        index: req.body.index,
        type: req.body.type,
        dishName: req.body.dishName,
        ingredient: req.body.ingredient
    }
    console.log(dishObj.id)
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("imenu");
            dbo.collection("dishes").findOneAndReplace({ id: dishObj.id }, dishObj, function (err, result) {
                if (err) {
                    res.status(400).send("Error:" + err)
                } else {
                    console.log("1 dish updated");
                    res.send("1 dish updated")
                    db.close();
                }
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.post('/deletedish', (req, res) => {
    const id = req.body.id;
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("imenu");
            dbo.collection("dishes").findOneAndDelete({ id: id }, function (err, result) {
                if (err) {
                    res.status(400).send("Error:" + err)
                } else {
                    console.log("one dish deleted");
                    res.send("one dish deleted")
                    db.close();
                }
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})

app.post('/findDishes', (req, res) => {
    const setName = req.body.setName
    MongoClient.connect(url, mongooseOptions)
        .then((db) => {
            var dbo = db.db("imenu");
            dbo.collection("dishes").find({ setName: setName }).toArray(function (err, result) {
                if (err) {
                    res.status(400).send("Error:" + err)
                } else {
                    console.log("dish found");
                    res.send(result)
                    db.close();
                }
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })
})



// app.post('/addnewuser', (req, res) => {
//     let userObj = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//     })
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("ichat");
//         dbo.collection("users").insertOne(userObj, function (err) {
//             if (err) {
//                 res.status(400).send("Error:" + err)
//             } else {
//                 console.log("1 user inserted");
//                 res.send("one user added")
//                 db.close();
//             }

//         });
//     });

// })




// app.post('/addnewchatroom', (req, res) => {
//     const uuid = uuidv4();
//     // console.log(uuidtest)
//     let chatroomObj = new ChatRoom({
//         roomID: uuid,
//         member: req.body.member,
//     })
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("ichat");
//         dbo.collection("chatroom").insertOne(chatroomObj, function (err) {
//             if (err) {
//                 res.status(400).send("Error:" + err)
//             } else {
//                 console.log("1 chatroom inserted");
//                 res.send("one chatroom added")
//             }
//         });
//     });
// })

// app.post('/addnewmessage', (req, res) => {
//     time = new Date();
//     let messageObj = new Message({
//         roomID: req.body.roomID,
//         sender: req.body.sender,
//         content: req.body.content,
//         time: time,
//     })
//     MongoClient.connect(url, async function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("ichat");
//         await dbo.collection("message").insertOne(messageObj, function (err) {
//             if (err) {
//                 res.status(400).send("Error:" + err)
//             } else {
//                 console.log("1 message inserted");
//                 res.send("one message added")
//                 db.close();
//             }

//         });
//     });
// })

app.listen(port, () => console.log(`listening to port ${port}`))