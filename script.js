const API_KEY = "AIzaSyDqz4okz51FunzRBD2sVT6FTPoDsvt2SkQ";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let choicesContainerEle = document.getElementById("all-choices-container");
let subscriptionsContainer = document.getElementById("subscriptions-container");
let searchBtn = document.getElementById("searchBtn");

const choicesArray = [
  "All",
  "Recruitment",
  "Vocubulary",
  "Data Science",
  "Algorithms",
  "Asian music",
  "New to you",
  "Vocubulary",
  "Data Science",
  "Algorithms",
  "Music",
  "Javascript",
  "Computer progrmming",
];

//Subscriptions nestead array
const subscriptionsArray = [
  ["./assets/profile1.svg", "James Gouse"],
  ["./assets/profile2.svg", "Alan Cooper"],
  ["./assets/profile3.svg", "Alexis Sears"],
  ["./assets/profile4.svg", "Jesica Lambert"],
  ["./assets/profile5.svg", "Anna White"],
  ["./assets/profile6.svg", "Skylar Dias"],
];

window.addEventListener("DOMContentLoaded", () => {
  fetchVideos("coding languages", 20);
});

choicesArray.map((choice) => {
  console.log("choice", choice);
  let divEle = document.createElement("div");
  // divEle.className="user-choice";
  divEle.innerHTML = `
  <h1 class="user-choice">${choice}</h1>
  `;
  choicesContainerEle.appendChild(divEle);
});

//Creating subscriptions profiles
function createSubscriptions(profile, name) {
  console.log(`${profile} and ${name}`);

  let subDiv = document.createElement("div");
  subDiv.className = "sidebar-options";
  subDiv.innerHTML = `
  <i class="icon"><img src=${profile} alt="Your Videos"></i>

  <h5>${name}</h5>
  `;
  subscriptionsContainer.appendChild(subDiv);
}

let arrLen = subscriptionsArray.length;
for (let i = 0; i < arrLen; i++) {
  console.log("sub arr", subscriptionsArray[i]);

  createSubscriptions(subscriptionsArray[i][0], subscriptionsArray[i][1]);
}

function scrollContainer(direction) {
  const container = document.getElementById("all-choices-container");

  if (direction === "right") {
    container.style.transform = "translateX(50px)";
  } else if (direction === "left") {
    container.style.transform = "translateX(-50px)";
  }
}

async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  // console.log("DATA ITEMS",data.items)
  displayVideos(data.items);
}

function displayVideos(videos) {
  const container = document.getElementById("video-gallery");
  container.innerHTML = "";

  videos.forEach((video) => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;

    const videoCard = document.createElement("div");
    videoCard.className = "video-card";
    videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}" class="video-link">
                <img src="${thumbnail}" alt="${title}" class="video">
                <div class="video-content">

                <h3 class="heading">${title}</h3>
                </div>
            </a>
        `;
    container.appendChild(videoCard);
  });
}

searchBtn.addEventListener("click", () => {
  let searchBarEle = document.getElementById("searchBar");
  let userSearching = searchBarEle.value;
  console.log("USER SEARCHING", userSearching);
  fetchVideos(userSearching, 20);
});
