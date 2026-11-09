const map = document.querySelector(".map");
const mapContent = document.querySelector(".map-content");

// size of the whole map drawing
const mapWidth = 1408;
const mapHeight = 860;

// part with the route and the pins
const routeWidth = 800;
const routeHeight = 600;

let zoom = 1; // 1 = zoomed out, 4 = max zoom
let moveX = 0;
let moveY = 0;

function getFit() {
  return Math.max(map.clientWidth / mapWidth, map.clientHeight / mapHeight);
}

function getStartZoom() {
  const routeFit = Math.min(map.clientWidth / routeWidth, map.clientHeight / routeHeight);
  return Math.min(4, Math.max(1, routeFit / getFit()));
}

function showMap() {
  if (!map || !mapContent) return;

  const scale = getFit() * zoom;

  // dont drag too far or you see the edge
  const maxX = Math.max(0, (mapWidth * scale - map.clientWidth) / 2);
  const maxY = Math.max(0, (mapHeight * scale - map.clientHeight) / 2);
  moveX = Math.min(maxX, Math.max(-maxX, moveX));
  moveY = Math.min(maxY, Math.max(-maxY, moveY));

  mapContent.style.transform = "translate(" + moveX + "px, " + moveY + "px) scale(" + scale + ")";

  const zoomOut = document.querySelector("#zoom-out");
  const zoomIn = document.querySelector("#zoom-in");
  if (zoomOut) zoomOut.disabled = zoom <= 1;
  if (zoomIn) zoomIn.disabled = zoom >= 4;
}

function changeZoom(newZoom) {
  newZoom = Math.min(4, Math.max(1, newZoom));
  moveX = moveX * newZoom / zoom;
  moveY = moveY * newZoom / zoom;
  zoom = newZoom;
  showMap();
}

// start with the whole route in view
if (map && mapContent) {
  zoom = getStartZoom();
  mapContent.style.transition = "none";
}
showMap();
setTimeout(function () {
  if (mapContent) mapContent.style.transition = "";
}, 50);
window.addEventListener("resize", showMap);

// zoom buttons
const zoomInButton = document.querySelector("#zoom-in");
const zoomOutButton = document.querySelector("#zoom-out");
const recenterButton = document.querySelector("#recenter");

if (zoomInButton) {
  zoomInButton.addEventListener("click", function () {
    changeZoom(zoom + 0.5);
  });
}

if (zoomOutButton) {
  zoomOutButton.addEventListener("click", function () {
    changeZoom(zoom - 0.5);
  });
}

// back to start
if (recenterButton) {
  recenterButton.addEventListener("click", function () {
    zoom = getStartZoom();
    moveX = 0;
    moveY = 0;
    showMap();
  });
}

// zoom with mouse wheel
if (map) {
  map.addEventListener("wheel", function (event) {
    event.preventDefault();
    if (event.deltaY < 0) {
      changeZoom(zoom + 0.25);
    } else {
      changeZoom(zoom - 0.25);
    }
  }, { passive: false });
}

// drag the map with the mouse
let dragging = false;
let dragged = false;
let startX = 0;
let startY = 0;

if (map) {
  map.addEventListener("pointerdown", function (event) {
    // dont drag when clicking a button
    if (event.target.closest("button, label, .toggle")) return;
    dragging = true;
    dragged = false;
    startX = event.clientX - moveX;
    startY = event.clientY - moveY;
    map.classList.add("dragging");
  });

  window.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    const newX = event.clientX - startX;
    const newY = event.clientY - startY;
    if (Math.abs(newX - moveX) + Math.abs(newY - moveY) > 3) dragged = true;
    moveX = newX;
    moveY = newY;
    showMap();
  });

  window.addEventListener("pointerup", function () {
    dragging = false;
    map.classList.remove("dragging");
  });

  // dont open a pin after dragging
  map.addEventListener("click", function (event) {
    if (dragged) {
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }
  }, true);

  map.addEventListener("dragstart", function (event) {
    event.preventDefault();
  });
}

// back to previous page
document.querySelectorAll(".go-back").forEach(function (button) {
  button.addEventListener("click", function (event) {
    if (history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
