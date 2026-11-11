// QR code on the big screen → opens the same place on the runner's Apple Watch.
// Big screen page → watch page:
const watchPages = {
  "water.html": "watch-water.html",
  "toilet.html": "watch-toilet.html",
  "equipment.html": "watch-equipment.html",
  "emergency.html": "watch-location.html"
};

// the Apple Watch pages are online here (public GitHub Pages site).
// The group repo is private, so the watch pages live in a separate public repo:
// github.com/Tania-coder/marathon-watch
const onlineSite = "https://tania-coder.github.io/marathon-watch/";

const thisPage = decodeURIComponent(location.pathname.split("/").pop());
const watchPage = watchPages[thisPage];
const qrImage = document.querySelector(".qr img");

if (watchPage && qrImage) {
  const watchUrl = onlineSite + watchPage;

  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent(watchUrl);

  // on a computer you can also click the QR code to see the watch
  const link = document.createElement("a");
  link.href = watchPage;
  link.title = "Open on Apple Watch";
  qrImage.parentNode.insertBefore(link, qrImage);
  link.appendChild(qrImage);
}
