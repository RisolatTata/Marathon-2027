// zoom knoppen van de map
// =========================================================
// MAP: drag with the mouse, zoom (+ / − / mouse wheel),
// ◎ = back to "you are here", and the "Back" button.
// Used by every page with a map.
// =========================================================
const map = document.querySelector(".map");
const mapContent = document.querySelector(".map-content");

// the whole drawing is 1408 x 860 (with the extra land around the 808 x 660 middle)
const DRAWING_W = 1408;
const DRAWING_H = 860;

// the part with the route + all pins (with a bit of space around it)
const ROUTE_W = 800;
const ROUTE_H = 600;

let zoom = 1;        // 1 = zoomed out all the way, 4 = closest
let moveX = 0;       // how far the map is dragged left/right (in px)
let moveY = 0;       // how far the map is dragged up/down (in px)

// zoom 1 = the whole drawing just fills the map box
function getFit() {
  return Math.max(map.clientWidth / DRAWING_W, map.clientHeight / DRAWING_H);
}

// the zoom where the route fills the map box (here the map starts)
function getStartZoom() {
  const routeFit = Math.min(map.clientWidth / ROUTE_W, map.clientHeight / ROUTE_H);
  return Math.min(4, Math.max(1, routeFit / getFit()));
}


// --- SHOW THE MAP with the current zoom + drag ---
function showMap() {
  if (!map || !mapContent) return;

  const scale = getFit() * zoom;

  // don't let the map be dragged so far that empty space shows at the edges
  const maxX = Math.max(0, (DRAWING_W * scale - map.clientWidth) / 2);
  const maxY = Math.max(0, (DRAWING_H * scale - map.clientHeight) / 2);
  moveX = Math.min(maxX, Math.max(-maxX, moveX));
  moveY = Math.min(maxY, Math.max(-maxY, moveY));

  mapContent.style.transform =
    "translate(" + moveX + "px, " + moveY + "px) scale(" + scale + ")";

  // grey out "−" when you can't zoom out more, "+" when you can't zoom in more
  const zoomOut = document.querySelector("#zoom-out");
  const zoomIn = document.querySelector("#zoom-in");
  if (zoomOut) zoomOut.disabled = zoom <= 1;
  if (zoomIn) zoomIn.disabled = zoom >= 4;
}

// zoom in or out, keeping the middle of what you see in the middle
function changeZoom(newZoom) {
  newZoom = Math.min(4, Math.max(1, newZoom));
  moveX = moveX * newZoom / zoom;
  moveY = moveY * newZoom / zoom;
  zoom = newZoom;
  showMap();
}

// start with the whole route in view, without the zoom animation
if (map && mapContent) {
  zoom = getStartZoom();
  mapContent.style.transition = "none";
}
showMap();
setTimeout(function () {
  if (mapContent) mapContent.style.transition = "";
}, 50);
window.addEventListener("resize", showMap);   // window bigger/smaller → fit again

// terug naar vorige pagina

// --- BUTTONS (only on pages that have them) ---
const zoomInButton = document.querySelector("#zoom-in");
const zoomOutButton = document.querySelector("#zoom-out");
const recenterButton = document.querySelector("#recenter");

// + : closer
if (zoomInButton) {
  zoomInButton.addEventListener("click", function () {
    changeZoom(zoom + 0.5);
  });
}

// − : further away
if (zoomOutButton) {
  zoomOutButton.addEventListener("click", function () {
    changeZoom(zoom - 0.5);
  });
}

// ◎ : back to the start size, "you are here" in the middle
if (recenterButton) {
  recenterButton.addEventListener("click", function () {
    zoom = getStartZoom();
    moveX = 0;
    moveY = 0;
    showMap();
  });
}


// --- MOUSE WHEEL = zoom ---
if (map) {
  map.addEventListener("wheel", function (event) {
    event.preventDefault();                       // don't scroll the page
    changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
  }, { passive: false });
}


// --- DRAG THE MAP with the mouse (or a finger) ---
let dragging = false;
let dragged = false;   // true if the mouse really moved (then it is not a click)
let startX = 0;
let startY = 0;

if (map) {
  map.addEventListener("pointerdown", function (event) {
    // buttons, the switch and the panel stay normal clicks
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

  // after dragging, don't open the pin the mouse stopped on
  map.addEventListener("click", function (event) {
    if (dragged) {
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }
  }, true);

  // stop the browser from dragging the map picture itself
  map.addEventListener("dragstart", function (event) {
    event.preventDefault();
  });
}


// --- BACK ---
// Elements with class "go-back" return to the previous page.
// If there is no previous page, the normal link (href) is used.
document.querySelectorAll(".go-back").forEach(function (button) {
  button.addEventListener("click", function (event) {
    if (history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
