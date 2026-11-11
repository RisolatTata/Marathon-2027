// the qr code on the big screen opens the same page on the apple watch

// big screen page and the watch page that goes with it
const watchPages = {
  "water.html": "watch-water.html",
  "toilet.html": "watch-toilet.html",
  "equipment.html": "watch-equipment.html",
  "emergency.html": "watch-location.html"
};

// our repo is private so the watch pages are online in a public repo of tania
// github.com/Tania-coder/marathon-watch
const onlineSite = "https://tania-coder.github.io/marathon-watch/";

// name of this page, like "water.html"
const thisPage = location.pathname.split("/").pop();
const watchPage = watchPages[thisPage];
const qrImage = document.querySelector(".qr img");

if (watchPage && qrImage) {
  const watchUrl = onlineSite + watchPage;
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + watchUrl;

  // on a computer you can click the qr code to see the watch
  const link = document.createElement("a");
  link.href = watchPage;
  link.title = "Open on Apple Watch";
  qrImage.parentNode.insertBefore(link, qrImage);
  link.appendChild(qrImage);
}
