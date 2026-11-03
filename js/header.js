// Header: the same on every page, so it is written here only once
document.querySelector("header").innerHTML = `
  <div class="logo">
    <img src="assets/Logo.png" alt="Logo">
    <h2>Copenhagen Marathon</h2>
  </div>
  <div class="info">
    <div>
      <p class="label">Weather</p>
      <p class="value" id="weather">17°C</p>
    </div>
    <div>
      <p class="label">Time left</p>
      <p class="value" id="time-left">2h 30min</p>
    </div>
    <a class="home-button" href="Home.html">⌂</a>
  </div>
`;


// Weather in Copenhagen centre
fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current=temperature_2m")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    document.querySelector("#weather").textContent = Math.round(data.current.temperature_2m) + "°C";
  });


// Time left: starts at 2h 30min, counts down every second
// and is saved, so it keeps going on the next page
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
