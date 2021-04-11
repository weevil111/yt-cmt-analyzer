# Youtube-Comments-Sentiment-Analyser
A web application for sentiment analysis of Youtube comments

# Getting started
```
git clone https://github.com/weevil111/yt-cmt-analyzer.git`
cd yt-cmt-analyzer`
npm i
npm run dev
```


## The process is divided into three phases:

### Phase 1
  1. Get a list of all the videos of the particular channel or playlist. This phase is skipped when a youtube *video url* is entered on the home page.
  2. Using puppeteer, Youtube page is crawled and list of videos is scraped.
  3. Each list item contains a *videoId* and *video title*
  4. For each list, thumbnail is fetched using `img.youtube.com`

### Phase 2
  1. Get a list of comments for the video that is selected for analysis
  2. The comments are crawled from online tool `https://youtuberandomcomment.com`.
  3. These comments are then transfered to the frontend in json format

### Phase 3
  1. The comments are now sent to the monkeylearn API : `https://api.monkeylearn.com/v3/classifiers/cl_pi3C7JiL/classify/`
  2. The API return either one of:
      * Positive
      * Neutral
      * Negative
     along with the confidence of the classification ( in percentage )
  3. The web app now calcultes the percentage of *Positive*, *Negative* and *Neutral* comments and displays accordingly. 
