const puppeteer = require('puppeteer');

async function scroll(page, numberOfVideos){

  let numberofTimes = parseInt(numberOfVideos/100); // Each scroll loads 100 more videos
  if(numberOfVideos % 100 == 0){
    numberofTimes -= 1; 
    // for example, if number of videos required = 100 then don't scroll as 1-100 video are already loaded
    // if number of videos required = 101 then scroll as video no. 101 is not loaded
  }

  let currentHeight = 0;
  try{
    while(numberofTimes>0){
      currentHeight =  await page.$$eval("#contents", el => {
        return el[2].scrollHeight
      })
      await page.evaluate(`window.scrollTo(0,${currentHeight})`)
      // Before next scroll, ensure that contents have been loaded by current scroll that we performed: 
      // (by waiting for container height to increase)
      await page.waitForFunction(`document.querySelectorAll("#contents")[2].scrollHeight>${currentHeight}`);
      numberofTimes -= 1;
    }
  }catch(e){
    console.log("Error ", e);
  }
}

async function getData(page, totalNumberOfVideos){
  let data = await page.$$eval("#contents", (el, total) => {
    let videoElementList = Array.from(el[2].children);
    if (videoElementList.length < total){
      videoElementList.pop(); // last child is just a spinner in case all the videos were not loaded
    }
    let result = []
    videoElementList.forEach(videoElement => {
      console.log(videoElement.querySelector("#video-title"));
      let videoTitle = videoElement.querySelector("#video-title").text.trim();
      let videoLink = videoElement.querySelector("#video-title").href;
      result.push({
        title: videoTitle,
        videoId: videoLink.substring(32, videoLink.indexOf("&list"))
      })
    });
    return result;
  }, totalNumberOfVideos)
  return data;
}

async function getVideoList({channelUrl, numberOfVideos = 1001}) {

  let result = {};
  let playlistId = "";
  let totalNumberOfVideos = 0;

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(`${channelUrl}/videos`);
  
  playlistId =  await page.$$eval("a.yt-simple-endpoint.ytd-button-renderer", links => {
    const playAllLink = links.find( link => link.text.trim() === "Play all").href;
    const playlistId  = playAllLink.substring(38,playAllLink.indexOf("&play"));
    return playlistId;
  })
  await page.goto(`https://www.youtube.com/playlist?list=${playlistId}`);

  totalNumberOfVideos = await page.$eval("#stats.ytd-playlist-sidebar-primary-info-renderer span", el => {
    return el.textContent;
  });

  totalNumberOfVideos = parseInt(totalNumberOfVideos, 10);

  await scroll(page, Math.min(numberOfVideos, totalNumberOfVideos) ); 

  result.videos = await getData(page, totalNumberOfVideos);
  result.videos.splice(Math.min(numberOfVideos,totalNumberOfVideos))
  result.totalChannelVideos = totalNumberOfVideos;

  
  await browser.close();
  return result;
};
// (async function(){
// console.log(await getVideoList("https://www.youtube.com/channel/UC7rNzgC2fEBVpb-q_acpsmw"))
// })();

module.exports = getVideoList
