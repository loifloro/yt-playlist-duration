import "../main.scss";

const API_KEY = "AIzaSyDime4ODLCwiQPnDKcaY4pmhVv4KlZGKfY";

const searchBtn = document.getElementById("searchBtn");
let resultTime = document.getElementById("result-time");
let url = document.getElementById("searchInput").value;
const copyBtn = document.getElementById("copy-btn");
const durationSpeed = document.getElementById("duration-speed");
let loader = document.getElementById("loader");
let resultSection = document.getElementById("result");
let totalSeconds;

let urlError = document.getElementById("searchError");
let videoId = [];

let playlistId = "";
const timeDuration = {};

searchBtn.addEventListener("click", () => {
  videoId = [];
  getPlaylistID(url);
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultTime.innerText);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});

function showSearchError(err) {
  urlError.classList.remove("search__error--hidden");
  urlError.innerText = err;
}

async function getPlaylistID(url) {
  if (!url.match("https://www.youtube.com/playlist?")) {
    return showSearchError("Please input valid URL Link");
  }

  if (url.match("list=")) {
    playlistId = url.slice(url.indexOf("list=") + 5);
    urlError.classList.add("search__error--hidden");
    await showThumbnail();
    return getPlayListItems();
  }
}

async function showThumbnail() {
  let resultThumbnail = document.getElementById("resultThumbnail");
  let resultTitle = document.getElementById("resultTitle");

  loader.classList.remove("loader--hidden");
  resultSection.classList.add("result--hidden");

  let info = document.querySelectorAll(".info");
  info.forEach((item) => {
    item.classList.add("info--hidden");
  });

  await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      resultThumbnail.src = data.items[0].snippet.thumbnails.standard.url;
      resultTitle.innerText = data.items[0].snippet.title;
      resultBtn = document.getElementById("resultBtn");

      resultBtn.addEventListener("click", () => {
        window.open(url, "_blank");
      });

      return;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Get all videoId in the playlist and push to videoId[]
async function getPlayListItems(pageToken = "") {
  await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.items.length == 0) {
        return showSearchError("No Video Found");
      }

      for (let i = 0; i < data.items.length; i++) {
        videoId.push(data.items[i].contentDetails.videoId);
      }

      if (data.hasOwnProperty("nextPageToken")) {
        return getPlayListItems(data.nextPageToken);
      } else {
        let resultTotalVid = document.getElementById("resultTotalVid");
        resultTotalVid.innerText = data.pageInfo.totalResults;

        return getVideoDuration(videoId);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Get all video duration in PTDHMS format and push to durationList[]
async function getVideoDuration(videoIdList) {
  const durationList = [];
  for (let k = 0; k < videoIdList.length; k++) {
    durationList.push(
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIdList[k]}&key=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.items[0] != undefined) {
            let duration = data.items[0].contentDetails.duration;
            return duration;
          } else {
            return 0;
          }
        })
    );
  }

  return computeTotal(durationList);
}

function computeTotal(durationList) {
  console.log(durationList);

  timeDuration.day = 0;
  timeDuration.hour = 0;
  timeDuration.minute = 0;
  timeDuration.seconds = 0;

  for (let l = 0; l < durationList.length; l++) {
    if (typeof durationList[l] == "string") {
      if (durationList[l].indexOf("D") != -1) {
        timeDuration.day = Number(
          durationList[l].slice(
            durationList[l].indexOf("P") + 1,
            durationList[l].indexOf("D")
          )
        );
        timeDuration.hour = Number(
          durationList[l].slice(
            durationList[l].indexOf("T") + 1,
            durationList[l].indexOf("H")
          )
        );
        timeDuration.minute = Number(
          durationList[l].slice(
            durationList[l].indexOf("H") + 1,
            durationList[l].indexOf("M")
          )
        );
        timeDuration.seconds = Number(
          durationList[l].slice(
            durationList[l].indexOf("M") + 1,
            durationList[l].indexOf("S")
          )
        );
      } else if (durationList[l].indexOf("H") != -1) {
        timeDuration.hour = Number(
          durationList[l].slice(
            durationList[l].indexOf("T") + 1,
            durationList[l].indexOf("H")
          )
        );
        timeDuration.minute = Number(
          durationList[l].slice(
            durationList[l].indexOf("H") + 1,
            durationList[l].indexOf("M")
          )
        );
        timeDuration.seconds = Number(
          durationList[l].slice(
            durationList[l].indexOf("M") + 1,
            durationList[l].indexOf("S")
          )
        );
      } else if (durationList[l].indexOf("M") != -1) {
        timeDuration.minute = Number(
          durationList[l].slice(
            durationList[l].indexOf("T") + 1,
            durationList[l].indexOf("M")
          )
        );
        timeDuration.seconds = Number(
          durationList[l].slice(
            durationList[l].indexOf("M") + 1,
            durationList[l].indexOf("S")
          )
        );
      } else if (durationList[l].indexOf("S") != -1) {
        timeDuration.seconds = Number(
          durationList[l].slice(
            durationList[l].indexOf("T") + 1,
            durationList[l].indexOf("S")
          )
        );
      }

      let total =
        timeDuration.day * 86400 +
        timeDuration.hour * 3600 +
        timeDuration.minute * 60 +
        timeDuration.seconds;

      durationList[l] = total;
    }
  }
  totalSeconds = 0;
  durationList.forEach((num) => {
    totalSeconds += num;
  });

  return showTotal(totalSeconds);
}

function showTotal(totalSeconds) {
  console.log(totalSeconds);
  const day = 86400;
  const hour = 3600;
  const minute = 60;

  timeDuration.day = Math.floor(totalSeconds / day);
  timeDuration.hour = Math.floor(
    (totalSeconds - timeDuration.day * day) / hour
  );
  timeDuration.minute = Math.floor(
    (totalSeconds - timeDuration.day * day - timeDuration.hour * hour) / minute
  );

  timeDuration.seconds =
    totalSeconds -
    timeDuration.day * day -
    timeDuration.hour * hour -
    timeDuration.minute * minute;

  console.log(timeDuration);
  let resultString = "";

  if (timeDuration.day != 0 && timeDuration.day == 1) {
    resultString += `${timeDuration.day} day `;
  } else if (timeDuration.day != 0) {
    resultString += `${timeDuration.day} days `;
  }
  if (timeDuration.hour != 0 && timeDuration.hour == 1) {
    resultString += `${timeDuration.hour} hour `;
  } else if (timeDuration.hour != 0) {
    resultString += `${timeDuration.hour} hours `;
  }
  if (timeDuration.minute != 0 && timeDuration.minute == 1) {
    resultString += `${timeDuration.minute} minute `;
  } else if (timeDuration.hour != 0) {
    resultString += `${timeDuration.minute} minutes `;
  }
  if (timeDuration.seconds != 0 && timeDuration.seconds == 1) {
    resultString += `${timeDuration.seconds} second `;
  } else if (timeDuration.seconds != 0) {
    resultString += `${timeDuration.seconds} seconds `;
  }

  resultTime.innerText = resultString;
  resultSection.classList.remove("result--hidden");
  loader.classList.add("loader--hidden");

  return timeDuration;
}

durationSpeed.addEventListener("change", () => {
  let temp = totalSeconds;
  temp *= durationSpeed.value;
  showTotal(temp);
});

// getPlayListItems();
