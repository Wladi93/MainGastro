(function () {
  "use strict";

  function getBaseURL() {
    var currentDomain = window.location.hostname;
    var isLocal =
      currentDomain === "localhost" || currentDomain === "127.0.0.1";

    var baseURL = isLocal
      ? "http://localhost:5008/"
      : "https://" + currentDomain + "/";
    return baseURL;
  }

  function getFullImageUrl(imgUrl) {
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      return imgUrl;
    }

    var apiBaseURL = getBaseURL();
    var normalizedBaseURL = apiBaseURL.endsWith("/")
      ? apiBaseURL
      : apiBaseURL + "/";
    var cleanedImgUrl = imgUrl.replace(/^\/+/, "");

    return normalizedBaseURL + cleanedImgUrl;
  }

  function setFaviconWithAspectRatio(imageUrl) {
    var img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      var size = 64;
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, size, size);

      var scale = Math.min(size / img.width, size / img.height);
      var drawWidth = img.width * scale;
      var drawHeight = img.height * scale;
      var offsetX = (size - drawWidth) / 2;
      var offsetY = (size - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      var faviconElement = document.getElementById("dynamic-favicon");
      if (faviconElement) {
        faviconElement.href = canvas.toDataURL("image/png");
      }
    };

    img.onerror = function () {
      // Fallback: URL direkt setzen falls CORS fehlschlägt
      console.warn("Canvas-Favicon fehlgeschlagen, setze URL direkt:", imageUrl);
      var faviconElement = document.getElementById("dynamic-favicon");
      if (faviconElement) {
        faviconElement.href = imageUrl;
      }
    };

    img.src = imageUrl;
  }

  function loadDynamicContent() {
    var baseURL = getBaseURL();

    Promise.all([
      fetch(baseURL + "api/firmenname").then(function (response) {
        return response.json();
      }),
      fetch(baseURL + "api/logo").then(function (response) {
        return response.json();
      }),
    ])
      .then(function (results) {
        var firmenData = results[0];
        var logoData = results[1];

        if (firmenData && firmenData.length > 0) {
          var titleElement = document.getElementById("dynamic-title");
          if (titleElement) {
            titleElement.textContent = firmenData[0].firmenName;
          }
        }

        if (logoData && logoData.length > 0) {
          var logoItem = logoData.find(function (item) {
            return item.id === 1;
          });
          if (logoItem) {
            setFaviconWithAspectRatio(getFullImageUrl(logoItem.url));
          }
        }
      })
      .catch(function (error) {
        console.error("Fehler beim Laden der dynamischen Inhalte:", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadDynamicContent);
  } else {
    loadDynamicContent();
  }
})();