# Youtube Playlist Duration Calculator

This app calculates the total length of a YouTube Playlist. The result can also be translated to other speed options.

## How to use

Copy a YouTube playlist URL and paste on the search input.

## Tech Stack

**Client:** Vanilla JS, SASS, CSS, Normalize.css

**Server:** Netlify, Webpack

## Lessons Learned

In this project I have use Fetch API to get the API response.

I have also learned how to use Asynchronous functions.

```javascript
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
```

## Feedback

I know that there is much needed optimization for this small application. Specially on the runtime speed. If you have any suggestions, feel free to email me jlois.floro@gmail.com
