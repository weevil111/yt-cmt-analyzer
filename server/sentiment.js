let axios = require('axios');
const fs = require('fs');
const path = require('path');

function loadTokens(){
  let tokens = fs.readFileSync(path.join(__dirname,"/tokens.txt"),"utf-8");
  tokens = JSON.parse(tokens);
  return tokens;
}

function updateTokenData(tokenList){
  fs.writeFile(path.join(__dirname,"/tokens.txt"),JSON.stringify(tokenList), function(err){
    if(err){
      console.log(err);
    }else{
      console.log("File Write successfull");
    }
  })
}

function findTokenWithLimitRemaining(tokens, numberOfComments){
  let tokenId = Object.keys(tokens).find(tokenId => tokens[tokenId] >= numberOfComments );
  return tokenId;
}

async function findSentiments(comments){
  
  let tokenList = loadTokens();
  let token = findTokenWithLimitRemaining(tokenList, comments.length);
  if(!token){
    return {
      error: "Sentiment analysis api limit reached"
    }
  }
  let responses = [];
  if(comments.length !== 0){
    responses = await axios.post("https://api.monkeylearn.com/v3/classifiers/cl_pi3C7JiL/classify/", {
      data: comments
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    }).then(resp => {
      tokenList[token] = resp.headers["x-query-limit-remaining"];
      updateTokenData(tokenList);
      console.log(resp.headers["x-query-limit-remaining"]);
      return resp.data;
    });
  }
  return responses;
}

module.exports = findSentiments;