const API_KEY = "AIzaSyDqz4okz51FunzRBD2sVT6FTPoDsvt2SkQ";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const profilesArray = [
  "./assets/profile1.svg",
  "./assets/profile2.svg",
  "./assets/profile3.svg",
  "./assets/profile4.svg",
  "./assets/profile5.svg",
  "./assets/profile6.svg",
];

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("videoId");

  if (videoId) {
    loadVideo(videoId);
    loadComments(videoId);
    loadVideoDetails(videoId);
  } else {
    console.error("No video ID found in URL");
  }
});

function loadVideo(videoId) {
  if (YT) {
    new YT.Player("video-container", {
      height: "500",
      width: "1000",
      videoId: videoId,
    });
  }
}

async function loadVideoDetails(videoId) {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const channelId = data.items[0].snippet.channelId;
      loadChannelInfo(channelId);
    }
  } catch (error) {
    console.error("Error fetching video details: ", error);
  }
}

async function loadChannelInfo(channelId) {
  try {
    const response = await fetch(
      `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items) {
      displayChannelInfo(data.items[0]);
      loadRecommendedVideos(data.items[0].snippet.title);
    }
  } catch (error) {
    console.error("Error fetching channel info: ", error);
  }
}

function displayChannelInfo(channelData) {
  const channelInfoSection = document.getElementById("channel-info");
  channelInfoSection.innerHTML = `
        <h3>${channelData.snippet.title}</h3>
        <img src="${channelData.snippet.thumbnails.default.url}" alt="${channelData.snippet.title}">
        <p>${channelData.snippet.description}</p>
    `;
}

async function loadComments(videoId) {
  try {
    const response = await fetch(
      `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("comments", data);
    if (data.items) {
      displayComments(data.items);
    } else {
      console.log("No comments available or data is undefined.");
    }
  } catch (error) {
    console.error("Error fetching comments: ", error);
  }
}

function displayComments(comments) {
  const commentSection = document.getElementById("comment-section");
  const commentsContainer = document.getElementById("comments-container");
  commentsContainer.innerHTML = "";

  comments.forEach((comment) => {
    const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
    console.log("COMMENT TEXT", commentText);

    //Getting user profiles
    for (let i = 0; i < profilesArray.length; i++) {
      let profile = profilesArray[i];
      console.log("PROFILE", profile);
      showProfile(profile);
    }
    function showProfile(profile) {
      const profileElement = document.createElement("div");
      //   const commentElement = document.createElement("p");
      profileElement.className = "profile-container";
      const commentDiv = document.createElement("div");

      profileElement.innerHTML = `
    <img src=${profile} alt="profile"/>
    <p class="title">${commentText}</p>

    
    `;

      commentsContainer.appendChild(profileElement);
      commentsContainer.appendChild(commentDiv);
    }
  });
}

async function loadRecommendedVideos(channelName) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${API_KEY}&maxResults=20&part=snippet&q=${channelName}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Recommended videos", data);
    if (data.items) {
      displayRecommendedVideos(data.items);
    } else {
      console.log("No recommended videos available or data is undefined.");
    }
  } catch (error) {
    console.error("Error fetching recommended videos: ", error);
  }
}

function displayRecommendedVideos(videos) {
  const recommendedSection = document.getElementById("recommended-videos");
  recommendedSection.innerHTML = "";

  videos.forEach((video) => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.default.url;
    const videoCard = document.createElement("div");
    videoCard.className = "video-card";
    videoCard.innerHTML = `
        <div>
            <a href="video.html?videoId=${videoId}" class="rec-link">
                <img src="${thumbnail}" alt="${title}">
            </a>
            </div>
            <div>
            <p class="rec-heading">${title}</p>
            </div>

        `;
    recommendedSection.appendChild(videoCard);
  });
}

async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  // console.log("DATA ITEMS",data.items)
  displayRecommendedVideos(data.items);
}

searchBtn.addEventListener("click", () => {
  let searchBarEle = document.getElementById("searchBar");
  let userSearching = searchBarEle.value;
  console.log("USER SEARCHING", userSearching);
  fetchVideos(userSearching, 20);
});
