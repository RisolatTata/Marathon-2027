// zoom knoppen van de map
const map = document.querySelector(".map");
const mapContent = document.querySelector(".map-content");
let zoom = 1;

function showZoom() {
  // kaart is 1408x860, op een groot scherm moet hij groter
  const fit = Math.max(1, map.clientWidth / 1408, map.clientHeight / 860);
  mapContent.style.transform = "scale(" + fit * zoom + ")";
}

document.querySelector("#zoom-in").addEventListener("click", function () {
  if (zoom < 2) zoom = zoom + 0.25;
  showZoom();
});

document.querySelector("#zoom-out").addEventListener("click", function () {
  if (zoom > 1) zoom = zoom - 0.25;
  showZoom();
});

document.querySelector("#recenter").addEventListener("click", function () {
  zoom = 1;
  showZoom();
});

showZoom();
window.addEventListener("resize", showZoom);

// terug naar vorige pagina
document.querySelectorAll(".go-back").forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
