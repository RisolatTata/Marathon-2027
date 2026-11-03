// Map zoom buttons: + (bigger), − (smaller), ◎ (normal size)
const map = document.querySelector(".map");
const mapContent = document.querySelector(".map-content");
let zoom = 1;

function showZoom() {
  // the drawing is 1408 x 860, on very big screens it has to grow to fill the map
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


// Links with class "go-back" go to the previous page (if there is one)
document.querySelectorAll(".go-back").forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
