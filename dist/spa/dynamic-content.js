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
            var faviconElement = document.getElementById("dynamic-favicon");
            if (faviconElement) {
              faviconElement.href = getFullImageUrl(logoItem.url);
            }
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
