const express = require('express');
const path = require('path');
const app = express();
const findSentiments = require("./sentiment");

const {getVideoList, getAllComments} = require("./automation");

app.use(express.json());
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile( path.join(__dirname,"/src/index.html"));
})

app.get("/info", (req, res) => {
  res.sendFile( path.join(__dirname,"/src/info.html"));
})

app.post("/videos", async(req, res) =>{
  let result = await getVideoList(req.body)
  res.json(result);
})

app.get("/comments", async(req, res)=> {
  let result = await getAllComments(req.query.videoId);
  res.json(result);
})

app.post("/sentiments", async (req,res)=>{
  const responses = await findSentiments(req.body.comments);
  // Max 300 in total for each gmail
  res.json({sentiments: responses});
})

app.listen(3000)