const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const notificationRoute = require("./routes/notification")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const path = require("path")
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:true},
  () => {
    console.log("Database connected");
  }
);

//middleware
app.use((req, res, next) => {  
  res.header("Access-Control-Allow-Credentials", true); 
  next();
});
app.use(express.json()); 
app.use(
  cors({
    origin: ["http://localhost:3000","https://www.prosper-media.cf","https://api.prosper-media.cf","https://admin.prosper-media.cf","http://localhost:4001"],
  })
); 
app.use(cookieParser());
app.use(express.json());
app.use(helmet()); 
app.use(morgan("common")); 

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications",notificationRoute)

app.listen(8800, () => {
  console.log("server is running");
});
