// Weather in Copenhagen centrum i thinks
fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current=temperature_2m")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    document.querySelector("#weather").textContent = Math.round(data.current.temperature_2m) + "°C";
  });


// Time left: starts at 2h 30min and counts down every second normally
// The time is saved, so it keeps going when you open another page
let secondsLeft = 2 * 3600 + 30 * 60;

if (sessionStorage.getItem("secondsLeft")) {
  secondsLeft = Number(sessionStorage.getItem("secondsLeft"));
}

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
