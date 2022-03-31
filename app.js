const path = require("path");
const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts")
const userRoutes = require("./routes/user");


const app = express();


// 1uzEfuAi98IlKcEu
//https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile
mongoose.connect('mongodb+srv://omermazorgroup:QXlBGgzaskMIjL2l@cluster0.pzt0d.mongodb.net/Snake?retryWrites=true&w=majority', {useNewUrlParser : true, useUnifiedTopology: true}).then(() => {

  console.log('server is connected to mongoDB');


}).catch((err) => {
  console.log(err);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use(express.static(path.join(__dirname, "src/app/posts/post-create")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
 next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);



const publicVapidKey = 'BAIvjXC8VkxH6h_JIJVxhfnoo52DsOi4kmzbwDd3f46W8MKIERfSXT_jEXJA1DlHUU6YkqNabZjWcSBR6R-KNaM';
const privateVapidKey = 'QA9O_nECt45Uava4IMjV5i051SvQTBQj7NpfsXWKhSg';
// webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);
// // Subscribe Route
// app.post('/subscribe', (req, res) => {
//   //Get pushSubscription object
//   const subscribe = req.body;

//   //Send 201 - resourse created
//   res.status(201).json({});

//   // Create payload
//   const payload = JSON.stringify({ title: 'Push Test' });

//   // Pass object into sendNotification
//   webpush.sendNotification(subscription, payload).catch(err => console.error(err));
// })



module.exports = app;
