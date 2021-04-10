
function setVideoData(videoList){
  const section = document.getElementById("videolist");
  section.innerHTML = ""; // Clear the already present videos
  console.log("I was called",videoList);
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
    .catch(err => console.log(err));
  }
})