// QR code on the big screen → opens the same place on the runner's Apple Watch.
// Big screen page → watch page:
const watchPages = {
  "water.html": "watch-water.html",
  "toilet.html": "watch-toilet.html",
  "equipment.html": "watch-equipment.html",
  "emergency.html": "watch-location.html"
};

// the site online (GitHub Pages). Used when the page is opened from your computer,
// because a phone/watch can't open a file or "localhost" on your laptop.
const onlineSite = "https://risolattata.github.io/Marathon-2027/";

const thisPage = decodeURIComponent(location.pathname.split("/").pop());
const watchPage = watchPages[thisPage];
const qrImage = document.querySelector(".qr img");

if (watchPage && qrImage) {
  const isOnline = location.protocol.startsWith("http") &&
    location.hostname !== "localhost" && location.hostname !== "127.0.0.1";
  const watchUrl = new URL(watchPage, isOnline ? location.href : onlineSite).href;

  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent(watchUrl);

  // on a computer you can also click the QR code to see the watch
  const link = document.createElement("a");
  link.href = watchPage;
  link.title = "Open on Apple Watch";
  qrImage.parentNode.insertBefore(link, qrImage);
  link.appendChild(qrImage);
}
