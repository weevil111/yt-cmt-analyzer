let videoId = window.location.search.substring(9);
document.getElementsByTagName("iframe")[0].src = `https://www.youtube.com/embed/${videoId}`;

function startLoading(){

    let icon = document.getElementById("go-icon")
    let btn = document.getElementById("goBtn");
    icon.classList.remove("fa-bar-chart");
    icon.classList.add("fa-spinner","fa-spin");
    btn.classList.add("button-disabled");
    btn.disabled = true;

  let valueContainers = Array.from(document.querySelectorAll(".dynamic-value"));
  valueContainers.forEach(container => {
    container.innerHTML = `
    ${container.tagName==="STRONG"? " : ": ""}
    <i class='fa fa-spinner fa-spin'></i>
    `
  });
}

function stopLoading(){
  let btn = document.getElementById("goBtn");
  let icon = document.getElementById("go-icon")
  icon.classList.remove("fa-spinner","fa-spin","button-disabled");
  icon.classList.add("fa-bar-chart");

  btn.classList.remove("button-disabled");
  btn.disabled = false;
}

async function getComments(){
  let comments = [];
  await fetch(`http://localhost:3000/comments?videoId=${videoId}`)
  .then(response => response.json())
  .then( data => comments = data)
  .catch(err => console.log(err))
  return comments;
}

async function getSentiment(comments){
  let response = []
  await fetch("http://localhost:3000/sentiments", {
    method: 'post',
    body: JSON.stringify({
      comments
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
  .then(data => response=data)
  .catch(err => console.log(err));
  return response.sentiments;
}

function fillFields({positive, neutral, negative}){
  console.log("Third",positive,neutral,negative);
  document.querySelector("#positive").innerHTML = ` : ${positive.toFixed(3)}`;
  document.querySelector("#neutral").innerHTML = ` : ${neutral.toFixed(3)}`;
  document.querySelector("#negative").innerHTML = ` : ${negative.toFixed(3)}`;
  console.log("Fourth",positive.toFixed(3),neutral.toFixed(3),negative.toFixed(3));
  const positiveBar = document.querySelector("#positive-bar");
  const neutralBar = document.querySelector("#neutral-bar");
  const negativeBar = document.querySelector("#negative-bar");
  
  positive = Math.round(positive);
  negative = Math.round(negative);
  neutral = 100 - positive - negative

  positiveBar.setAttribute("style",`width:${positive}%`);
  neutralBar.setAttribute("style",`width:${neutral}%`);
  negativeBar.setAttribute("style",`width:${negative}%`);

  positiveBar.children[0].innerHTML = `${positive}%`;
  neutralBar.children[0].innerHTML = `${neutral}%`;
  negativeBar.children[0].innerHTML = `${negative}%`;

}



async function analyse(){
  startLoading();
  let positive = 0, neutral = 0, negative = 0;
  let sentiments;
  let bucketSize = document.querySelector("input").value;
  if(!bucketSize){
    bucketSize = 20;
  }else{
    bucketSize = Math.min(parseInt(bucketSize,10),250);
  }
  const comments = await getComments();
  const commentTexts = comments.reduce((acc, val)=>{
    acc.push(val.textDisplay.trim());
    return acc;
  },[])
  bucketSize = Math.min(bucketSize, commentTexts.length);
  document.querySelector("#total").innerHTML = ` : ${comments.length}`;
  document.querySelector("#bucket").innerHTML = ` : ${bucketSize}`;

  if(comments.length > 0){
    sentiments = await getSentiment(commentTexts.slice(0,bucketSize));
    console.log("----",sentiments);
    sentiments.forEach(sentiment => {
      switch (sentiment.classifications[0].tag_name){
        case "Positive":
          positive += 1;
          break;
        case "Neutral":
          neutral += 1;
          break;
        case "Negative":
          negative += 1;
          break;
      }
      console.log("First",positive,neutral,negative);
      // Convert in percentage
    })
    positive = (positive/sentiments.length)*100;
    neutral = (neutral/sentiments.length)*100;
    negative = (negative/sentiments.length)*100;
    console.log("second",positive,neutral,negative);
    window.sentiments = sentiments;
  }
  fillFields({positive, neutral, negative});
  stopLoading();
}

document.querySelector("#goBtn").addEventListener("click", analyse)