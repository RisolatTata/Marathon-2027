// weer in kopenhagen
fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current=temperature_2m")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    document.querySelector("#weather").textContent = Math.round(data.current.temperature_2m) + "°C";
  });


// timer van 2h 30min
// This line makes sure it saves if u go to another tab so time save and doesn't reset
let secondsLeft = Number(sessionStorage.getItem("secondsLeft")) || 2 * 3600 + 30 * 60;

function showTimeLeft() {
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor(secondsLeft % 3600 / 60);
  const seconds = secondsLeft % 60;

  document.querySelector("#time-left").textContent = hours + "h " + minutes + "min " + seconds + "s";

  if (secondsLeft > 0) {
    secondsLeft = secondsLeft - 1;
  }
  sessionStorage.setItem("secondsLeft", secondsLeft);
}

showTimeLeft();
setInterval(showTimeLeft, 1000);
