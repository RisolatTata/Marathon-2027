// =========================================================
// Map buttons: zoom in (+), zoom out (−), recenter (◎)
// and the "Back" button.
// Used by: equipment.html, all-locations.html
// =========================================================

// --- ZOOM ---
let zoom = 1;                                        // 1 = normal size
const mapContent = document.querySelector(".map-content");

function showZoom() {
  mapContent.style.transform = "scale(" + zoom + ")";
}

// + : make the map bigger (max 2x)
document.querySelector("#zoom-in").addEventListener("click", function () {
  if (zoom < 2) zoom = zoom + 0.25;
  showZoom();
});

// − : make the map smaller (min 0.75x)
document.querySelector("#zoom-out").addEventListener("click", function () {
  if (zoom > 0.75) zoom = zoom - 0.25;
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
