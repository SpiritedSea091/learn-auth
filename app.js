require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true, useUnifiedTopology : true});

const userSchema = mongoose.Schema({
  username : String,
  password : String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
  res.render("home");
});

app.get("/login", (req,res)=>{
  res.render("login");
});

app.get("/register", (req,res)=>{
  res.render("register");
});

app.post("/register", (req,res)=>{
  const newUser = new User({
    username : req.body.username,
    password : req.body.password
  });
  newUser.save(function(err){
    if(err) res.send(err);
    else res.render("secrets");
  });
});

app.post("/login", (req,res)=>{
  const userLogin = new User({
    username : req.body.username,
    password : req.body.password
  });
  User.findOne({username: userLogin.username}, function(err, foundUser){
    if(err) res.send(err);
    else {
      if(foundUser){
        if(foundUser.password === userLogin.password) res.render("secrets");
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
