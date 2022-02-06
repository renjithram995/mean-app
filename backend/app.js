const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require("path") // to get the relative path for static path

const app = express();
const dbName = 'postMeanApp'
const connectionUrl = `mongodb+srv://renjithram995:rrhoeFC1Bd9qVyKC@postcluster0.6udpq.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const postsRoute = require('./routes/postroutes')
const userRoute = require('./routes/userroutes')

// mongosh "mongodb+srv://postcluster0.6udpq.mongodb.net/postMeanApp" --username renjithram995
mongoose.connect(connectionUrl).then(() => {
  console.log('Connected to database')
}).catch((error) => {
  console.log(error)
})
// const cors = require('cors');
// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next()
})
app.use("/images", express.static(path.join("backend/images"))) // to access static files through server
app.use('/api/posts', postsRoute)
app.use('/api/users', userRoute)


module.exports = app