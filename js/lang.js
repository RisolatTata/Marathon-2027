// language switch EN / DK
// the pages are in english, when you click DK we change every text to danish
// the choice is saved so the next page is in the same language

// english text and the danish text
const danish = {
  // header
  "Weather": "Vejr",
  "Time left": "Tid tilbage",
  "Home": "Forside",
  "Menu": "Menu",
  "Emergency": "Nødsituation",

  // home
  "Find location": "Find sted",
  "Open map": "Åbn kort",

  // menu
  "What do you need?": "Hvad har du brug for?",
  "Pick one and we show the nearest spot.": "Vælg en, så viser vi det nærmeste sted.",

  // places
  "Water station": "Vanddepot",
  "Toilets": "Toiletter",
  "Equipment": "Udstyr",
  "First aid": "Førstehjælp",
  "All locations": "Alle steder",

  // map
  "Show all locations": "Vis alle steder",
  "Zoom in": "Zoom ind",
  "Zoom out": "Zoom ud",
  "Back to my location": "Tilbage til min placering",
  "Tap a place to get directions": "Tryk på et sted for at få vej",

  // panel
  "Back": "Tilbage",
  "Wait time": "Ventetid",
  "In stock at this station": "På lager på dette depot",
  "Energy gels": "Energigeler",
  "Socks": "Strømper",
  "Plasters": "Plastre",
  "Water bottles": "Vandflasker",
  "Available": "På lager",
  "Low stock": "Få tilbage",
  "Out of stock": "Udsolgt",
  "QR code": "QR-kode",

  // first aid
  "In an emergency": "I nødstilfælde",
  "call": "ring",
  "Use your own phone and tell them where you are.": "Brug din egen telefon og fortæl, hvor du er.",
  "Your location is in the QR code below.": "Din placering står i QR-koden nedenfor.",
  "Scan for your exact location": "Scan for din præcise placering",
  "Read it out to the 112 operator": "Læs den op for 112-operatøren",
  "QR code with your location": "QR-kode med din placering",

  // watch
  "Water": "Vand",
  "left": "tilbage",
  "In stock": "På lager",
  "Yes": "Ja",
  "Low": "Få",
  "Out": "Udsolgt",
  "See what’s in stock": "Se hvad der er på lager",
  "Call 112": "Ring 112",
  "Your location": "Din placering",
  "Read it to the 112 operator": "Læs den op for 112-operatøren",
  "Done": "Færdig",
  "Open on Apple Watch": "Åbn på Apple Watch"
};

// parts of a text, for texts with a number in it like "2 km left" or "Station A (5 km)"
const danishParts = [
  ["see what’s in stock", "se hvad der er på lager"],
  ["send your location to medics", "send din placering til samaritterne"],
  ["Water station", "Vanddepot"],
  ["Station", "Depot"],
  ["away", "væk"],
  ["left", "tilbage"]
];

function toDanish(english) {
  // the whole text is in the list
  if (danish[english]) {
    return danish[english];
  }

  // page title like "Toilets - Copenhagen Marathon"
  const parts = english.split(" - ");
  if (parts.length == 2 && danish[parts[0]]) {
    return danish[parts[0]] + " - " + parts[1];
  }

  // change the parts we know
  let text = english;
  danishParts.forEach(function (part) {
    text = text.replace(part[0], part[1]);
  });
  return text;
}

function translateText(english, lang) {
  if (lang == "da") {
    return toDanish(english);
  }
  return english;
}

// alt, title and aria-label are texts you dont see but still need to change
function translateAttribute(attribute, lang) {
  document.querySelectorAll("[" + attribute + "]").forEach(function (element) {
    // save the english text the first time
    if (!element.hasAttribute("data-en-" + attribute)) {
      element.setAttribute("data-en-" + attribute, element.getAttribute(attribute));
    }

    const english = element.getAttribute("data-en-" + attribute);
    if (english != "") {
      element.setAttribute(attribute, translateText(english, lang));
    }
  });
}

function translatePage(lang) {
  document.documentElement.lang = lang;

  // all texts on the page
  document.querySelectorAll("body *").forEach(function (element) {
    // dont change the timer, the weather and the EN / DK buttons
    if (element.closest("script, #time-left, #weather, .lang-switch")) {
      return;
    }

    element.childNodes.forEach(function (node) {
      // only the text, not other elements
      if (node.nodeType != 3) {
        return;
      }

      // save the english text the first time
      if (node.english == undefined) {
        node.english = node.textContent;
      }

      const english = node.english.trim();
      if (english != "") {
        node.textContent = node.english.replace(english, translateText(english, lang));
      }
    });
  });

  translateAttribute("alt", lang);
  translateAttribute("title", lang);
  translateAttribute("aria-label", lang);

  // text in the browser tab
  if (document.englishTitle == undefined) {
    document.englishTitle = document.title;
  }
  document.title = translateText(document.englishTitle, lang);

  // make the clicked button dark
  document.querySelectorAll(".lang-switch button").forEach(function (button) {
    if (button.dataset.lang == lang) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// put the EN / DK buttons in the header
function addSwitch() {
  const info = document.querySelector("header .info");
  if (!info) {
    return;
  }

  const box = document.createElement("div");
  box.className = "lang-switch";
  box.innerHTML = '<button type="button" data-lang="en">EN</button><button type="button" data-lang="da">DK</button>';

  // before the home button (home page has no home button so then it goes at the end)
  const home = info.querySelector(".home-button");
  info.insertBefore(box, home);

  box.querySelectorAll("button").forEach(function (button) {
    button.addEventListener("click", function () {
      localStorage.setItem("lang", button.dataset.lang);
      translatePage(button.dataset.lang);
    });
  });
}

addSwitch();
translatePage(localStorage.getItem("lang") || "en");
