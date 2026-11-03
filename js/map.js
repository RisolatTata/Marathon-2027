// =========================================================
// Map buttons: zoom in (+), zoom out (−), recenter (◎)
// and the "Back" button.
// Used by: equipment.html, all-locations.html
// =========================================================

// --- ZOOM ---
let zoom = 1;                                        // 1 = normal size
const map = document.querySelector(".map");
const mapContent = document.querySelector(".map-content");

// the whole drawing is 1408 x 860, "fit" only makes it bigger on very big screens
function showZoom() {
  const fit = Math.max(1, map.clientWidth / 1408, map.clientHeight / 860);
  mapContent.style.transform = "scale(" + fit * zoom + ")";
}

showZoom();
window.addEventListener("resize", showZoom);         // window bigger/smaller → fit again

// + : make the map bigger (max 2x)
document.querySelector("#zoom-in").addEventListener("click", function () {
  if (zoom < 2) zoom = zoom + 0.25;
  showZoom();
});

// − : make the map smaller again (not smaller than the map box, else you see empty edges)
document.querySelector("#zoom-out").addEventListener("click", function () {
  if (zoom > 1) zoom = zoom - 0.25;
  showZoom();
});

//back to normal size
document.querySelector("#recenter").addEventListener("click", function () {
  zoom = 1;
  showZoom();
});


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
