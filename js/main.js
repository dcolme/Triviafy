let currentDataArray;

//load json data to buttons
async function loadData() {
  getServiceData();
  await sleep(2000);
  for (var optionIndex = 1; optionIndex <= 4; optionIndex++) {
    let option = document.getElementById("option" + optionIndex);
    option.innerText = currentDataArray[optionIndex - 1].name;
  }
}

//Load game
async function start() {
  // await loadData();
  document.getElementById("songData").style.display = "none"
  document.getElementById("lds-ellipsis").style.display = "none";
  const optionsRow = document.getElementById("optionsRow");
  optionsRow.style.display = "flex";
  optionsRow.classList.add("animated");
  optionsRow.classList.add("fadeIn");

  for (var optionIndex = 1; optionIndex <= 4; optionIndex++) {
    let option = document.getElementById("option" + optionIndex);
    option.disabled = false;
    if (option.classList.contains("is-danger")) {
      option.classList.replace("is-danger", "is-light");
    } else if (option.classList.contains("is-success")) {
      option.classList.replace("is-success", "is-light");
    }
  }

  document
    .getElementById("progressBar")
    .setAttribute("style", "display:block !important");
  progressBar();
}

let gameOver = false;

function isWinner(dataArray) {
  gameOver = true;
  const data = currentDataArray;
  let buttonSelectedId = window.event.target.id;
  let indexFinder = buttonSelectedId.replace("option", "");

  if (data[indexFinder - 1].winner == "true") {
    window.event.target.classList.replace("is-light", "is-success");
  } else {
    window.event.target.classList.replace("is-light", "is-danger");
  }

  for (var optionIndex = 1; optionIndex <= 4; optionIndex++) {
    let option = document.getElementById("option" + optionIndex);
    option.disabled = true;
  }

  document
    .getElementById("progressBar")
    .setAttribute("style", "display:none !important");
  document.getElementById("nextSong").style.display = "block";
  document.getElementById("songData").style.display = "block"
}

function nextSong() {
  document.getElementById("progressBar").value = 0;
  document.getElementById("nextSong").style.display = "none";
  gameOver = false;
  start();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




async function loading() {

  document
    .getElementById("progressBar")
    .setAttribute("style", "display:none !important");
  document.getElementById("start").style.display = "none";
  document.getElementById("nextSong").style.display = "none";
  document.getElementById("lds-ellipsis").style.display = "inline-block"
  const optionsRow = document.getElementById("optionsRow");
  optionsRow.style.display = "none";
  await loadData();
  playSong(device);
  forwardSong();
  getSongData();


}

async function progressBar() {
  await sleep(1000);
  let isYellow = false;
  let isRed = false;

  for (let i = 0; i <= 10; i++) {
    if (gameOver == true) {
      break;
    }
    if (i > 4) {
      if (i > 7) {
        document.getElementById("progressBar").classList.add("is-danger");
        document.getElementById("progressBar").classList.remove("is-warning");
        isYellow = false;
        isRed = true;
      } else {
        document.getElementById("progressBar").classList.add("is-warning");
        isYellow = true;
      }
    }

    document.getElementById("progressBar").value = i * 10;
    await sleep(1000);
  }

  document
    .getElementById("progressBar")
    .setAttribute("style", "display:none !important");
  document.getElementById("progressBar").value = 0;

  if (isYellow == true) {
    document
      .getElementById("progressBar")
      .classList.replace("is-warning", "is-success");
  } else if (isRed == true) {
    document
      .getElementById("progressBar")
      .classList.replace("is-danger", "is-success");
  }

  for (var optionIndex = 1; optionIndex <= 4; optionIndex++) {
    let option = document.getElementById("option" + optionIndex);
    option.disabled = true;
  }

  document.getElementById("nextSong").style.display = "block";
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

initializeSpotifySDK();

function initializeSpotifySDK() {
  window.onSpotifyWebPlaybackSDKReady = () => {
    //const token = 'BQDQ-i4UNdrD8cPCOZDHotKaN-xa2iMyQxpZSW5zGRyFX2jjFXtdBzRjC9hKsNs4zc4wQ-J2NkaYO5m6vr5E3BwrVo_txhf91o8TSEBT3oShOwlhC2uf_j3fbKc_hYUBb60GHU_8I4bs0MwQFg4ZjUbdiNdLoehD3sM';
    const player = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: cb => {
        cb(token);
      }
    });

    // Error handling
    player.addListener("initialization_error", ({
      message
    }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({
      message
    }) => {
      console.error(message);
    });
    player.addListener("account_error", ({
      message
    }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({
      message
    }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", state => {});

    // Ready
    player.addListener("ready", ({
      device_id
    }) => {
      console.log("Ready with Device ID", device_id);
      document.getElementById("start").classList.remove("is-loading");
      document.getElementById("start").disabled = false;
      device = device_id;
    });

    // Not Ready
    player.addListener("not_ready", ({
      device_id
    }) => {
      console.log("Device ID has gone offline", device_id);
    });


    // Connect to the player!
    player.connect();
  };
}

let device;
let songUri = "";
let token = "BQC08S_tDXf9mlh8j7LU_TeM188tRQOX91eT-dmIArMhMz4klohbYkJ4fexZDGoCVwvKHJHegiTh14JEWZhqiBnfTwEvy2igayfEuzVRnpcNDhT79oaHBXknmp1gBuAn3COxOe_ttxh1kWRt1eeZ3xka_7gr98LshwQ";

function getSongData() {
  $.ajax({
    url: "https://api.spotify.com/v1/tracks/" + songUri,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(data) {
      console.log(data);
    }
  });
}

function playSong(device_id) {
  $(document).ready(function() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
      type: "PUT",
      data: '{"uris": ["spotify:track:' + songUri + '"]}',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function(data) {
        console.log("Success!");
        nextSong();
      }
    });
  });
}

function forwardSong() {
  $(document).ready(function() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/seek?position_ms=55000",
      type: "PUT",

      data: '{"device_ids:": ' + device + '"]}',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function(response) {
        console.log("Forward 55s");
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  });
}

var soap = require("soap");

function getServiceData() {
  var url =
    "http://triviafywebservice1.us-east-1.elasticbeanstalk.com/TriviafyWebService.svc?wsdl";
  var args = {
    name: "TriviafyWebService"
  };
  soap.createClient(url, function(err, client) {
    client.GetFourRandomSongs(args, function(err, result) {
      var fourSongs = JSON.parse(result.GetFourRandomSongsResult);

      var gameRoundData = [{
          name: fourSongs[0].name,
          winner: "true",
        },
        {
          name: fourSongs[1].name,
          winner: "false",
        },
        {
          name: fourSongs[2].name,
          winner: "false",
        },
        {
          name: fourSongs[3].name,
          winner: "false",
        }
      ];
      // console.log(gameRoundData);
      let data = shuffle(gameRoundData);
      console.log(data);
      songUri = fourSongs[0].id;
      currentDataArray = data;
    });
  });

}



function onClickHandlers() {
  document.getElementById("start").onclick = loading;
  document.getElementById("nextSong").onclick = loading;
  document.getElementById("option1").onclick = isWinner;
  document.getElementById("option2").onclick = isWinner;
  document.getElementById("option3").onclick = isWinner;
  document.getElementById("option4").onclick = isWinner;
}

onClickHandlers();
