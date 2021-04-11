let axios = require('axios');
const fs = require('fs');
const path = require('path');

// Note - Each token can give sentiment analysis of at most 300 comments per month.
// Tokens are expendable entities. Moke tokens can be created by registering to monkeylearn.com
// using temporary disposable mails 

// Load the tokens from "tokens.txt" file
function loadTokens(){
  let tokens = fs.readFileSync(path.join(__dirname,"/tokens.txt"),"utf-8");
  tokens = JSON.parse(tokens);
  return tokens;
}

// Save the updated token data in "tokens.txt" file
function updateTokenData(tokenList){
  fs.writeFile(path.join(__dirname,"/tokens.txt"),JSON.stringify(tokenList), function(err){
    if(err){
      console.log(err);
    }else{
      console.log("File Write successfull");
    }
  })
}

// Find the token which has enough request limit reach to analyse given number of comments

function findTokenWithLimitRemaining(tokens, numberOfComments){
  let tokenId = Object.keys(tokens).find(tokenId => tokens[tokenId] >= numberOfComments );
  return tokenId;
}

/**
 *  Wrapper function that uses rest of the functions to carry out sentiment analysis
 * 
 *  @param {Array} comments | List of comments to analysed
 *  @returns 
 */

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
      return resp.data;
    });
  }
  return responses;
}

module.exports = findSentiments;