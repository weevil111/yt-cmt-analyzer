
function startLoading(){
  let icon = document.getElementById("search-icon")
  let btn = document.getElementById("findBtn");
  icon.classList.remove("fa-search");
  icon.classList.add("fa-spinner","fa-spin");
  btn.classList.add("button-disabled");
  btn.disabled = true;
  document.getElementById("videolist").innerHTML = ""
}
function stopLoading(){
  let btn = document.getElementById("findBtn");
  let icon = document.getElementById("search-icon")
  icon.classList.remove("fa-spinner","fa-spin","button-disabled");
  icon.classList.add("fa-search");

  btn.classList.remove("button-disabled");
  btn.disabled = false;
}

function setVideoData(videoList){
  const section = document.getElementById("videolist");
  section.innerHTML = ""; // Clear the already present videos
  videoList.forEach((video, index) => {
    let div = document.createElement("div");

    div.innerHTML = `
      <span class="serial">${index+1}.</span>
      <img src="https://img.youtube.com/vi/${video.videoId}/default.jpg" alt="Thumbnail">
      <div class="video-info">
        <h3>${video.title}</h3>
      </div>
      <button id="analyseBtn">ANALYSE</button>
    `;

    div.classList = ["list-item"];
    section.appendChild(div);
  });
}

function getUrlType(url){
  if(url.indexOf("/channel/") >= 0 || url.indexOf("/user/") >= 0 || url.indexOf("/c/") >= 0){
    return "channel";
  }else if(url.indexOf("/playlist") >= 0){
    return "playlist";
  }else if(url.indexOf("/watch") >= 0){
    return "video"
  }else{
    return "unknown";
  }
}

document.getElementById("findBtn").addEventListener("click", function(){
  let url = document.querySelectorAll("input")[0].value.trim();
  let numberOfVideos = parseInt(document.querySelectorAll("input")[1].value.trim(),10);
  let inputType = getUrlType(url);
  if(inputType !== "unknown"){
    startLoading();
    if(inputType==="video"){
      let videoId = url.substring(url.indexOf("v=")+2);
      if(videoId.indexOf("&") >= 0){ // Support for videos that are part of a playlist
        videoId = videoId.substring(0,videoId.indexOf("&"));
      }
      window.open(`/info?videoId=${videoId}`,target="_self")
      return;
    }

    let postUrl = "http://localhost:3000/videos?type="; 

    if(inputType === "playlist"){
      postUrl += "playlist";
    }else{
      postUrl += "channel";
    }

    fetch(postUrl,{
      method: "post",
      body: JSON.stringify({
        url,
        numberOfVideos
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( response => response.json())
    .then(json => setVideoData(json.videos))
    .catch(err => console.log(err))
    .finally(() => stopLoading())
  }else{
    alert("The url entered is invalid !");
  }
})

document.getElementById("videolist").addEventListener("click", function(e){
  if(e.target.tagName !== "BUTTON"){
    return;
  }

  const link = e.target.previousElementSibling.previousElementSibling.src;
  const videoId = link.substring(27, link.lastIndexOf("/"));
  window.open(`/info?videoId=${videoId}`,target="_self")

})