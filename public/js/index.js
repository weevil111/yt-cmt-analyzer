
function startLoading(){
  let icon = document.getElementById("search-icon")
  let btn = document.getElementById("findBtn");
  icon.classList.remove("fa-search");
  icon.classList.add("fa-spinner","fa-spin");
  btn.classList.add("button-disabled");
  btn.disabled = true;
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

document.getElementById("findBtn").addEventListener("click", function(){
  let channelUrl = document.querySelectorAll("input")[0].value.trim();
  let numberOfVideos = parseInt(document.querySelectorAll("input")[1].value.trim(),10);
  if(channelUrl.value !== ""){
    startLoading();
    fetch("http://localhost:3000/videos",{
      method: "post",
      body: JSON.stringify({
        channelUrl,
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