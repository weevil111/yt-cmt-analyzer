const express = require('express');
const path = require('path');
const app = express();

const getVideoList = require("./automation");

app.use(express.json());
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile( path.join(__dirname,"/index.html"));
})

app.get("/info", (req, res) => {
  res.sendFile( path.join(__dirname,"/info.html"));
})

app.post("/videos", async(req, res) =>{
  let result = await getVideoList({...req.body})
  res.json(result);
})

app.listen(3000)