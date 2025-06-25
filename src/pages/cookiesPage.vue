<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="fact_check" class="bannerIcon" />
      Cookies
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      unsere Cookies ...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>
  <q-img class="background-img" />
  <q-card class="my-card q-mt-md">
    <q-img class="img" src="./images/cookies.jpg">
      <div class="text text-subtitle2 absolute-top text-center">
        <h6>Cookie-Hinweis</h6>
        <q-separator inset class="q-mb-lg bg-grey-8" size="2px" />
        <h6 class="text-body2">
          Wir verwenden auf dieser Website Cookies, um die Benutzererfahrung zu
          verbessern und bestimmte Funktionen bereitzustellen. Einige Cookies
          werden von Drittanbietern gesetzt, wie zum Beispiel Google Maps, um
          Ihnen die Anfahrt zu erleichtern. Diese Cookies können Informationen
          über Ihre Nutzung der Kartenfunktion sammeln, um Ihnen eine
          personalisierte und genaue Routenplanung zu bieten.
        </h6>
        <p></p>
        <h6>Welche Cookies verwenden wir?</h6>
        <h6 class="text-body2">
          Google Maps: Wir nutzen Google Maps, um Ihnen eine interaktive Karte
          für die Anfahrt zu unserem Standort anzuzeigen. Google setzt Cookies,
          um den Standort zu speichern, und verwendet diese, um die Karte
          anzuzeigen und Ihnen die Navigation zu erleichtern.
        </h6>
        <p></p>
        <h6 class="text-body2">
          Notwendige Cookies: Wir verwenden Cookies, die für die Funktionalität
          der Website erforderlich sind, z.B. für das Kontaktformular und den
          Bestellprozess. Diese Cookies speichern Informationen nur
          vorübergehend, z.B. Ihre E-Mail-Adresse im Rahmen der Bestellung.
        </h6>
        <p></p>
        <h6>Welche Daten erfassen wir?</h6>
        <h6 class="text-body2">
          Bei der Bestellung erfassen wir lediglich die E-Mail-Adresse, um die
          Bestellung zu bestätigen und mit Ihnen in Kontakt zu treten. Wir
          speichern keine weiteren personenbezogenen Daten.
        </h6>
        <p></p>
        <h6 class="text-body2">
          Die Google Maps-Funktion sammelt keine personenbezogenen Daten von
          Ihnen, es sei denn, Sie interagieren mit den Kartendiensten von
          Google.
        </h6>
        <p></p>
        <h6>Wie lange werden die Cookies gespeichert?</h6>
        <h6 class="text-body2">
          Die Google Maps-Cookies und alle anderen Cookies, die für die
          Website-Funktionalität erforderlich sind, werden für eine kurze Dauer
          gespeichert und automatisch gelöscht, sobald sie nicht mehr benötigt
          werden.
        </h6>
        <p></p>
        <h6>Einwilligung</h6>
        <h6 class="text-body2">
          Ihre Einwilligung Durch die Nutzung dieser Website stimmen Sie der
          Verwendung von Cookies zu. Sie können Ihre Cookie-Einstellungen
          jederzeit anpassen, indem Sie den "Cookie-Einstellungen"-Link am
          unteren Rand der Seite besuchen.
        </h6>
        <p></p>
      </div>
    </q-img>
  </q-card>
  <h5 class="text-caption text-center color-secondary">
    Bestellen? zur
    <RouterLink class="text-secondary" to="/speisekarte"
      >Speisekarte</RouterLink
    >
  </h5>
</template>

<script setup lang="ts"></script>

<style scoped>
.my-card {
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  text-align: center;
  width: 94%;
  height: auto;
}
.img {
  max-width: 900px;
  height: 800px;
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/cookies.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.text {
  display: grid;
  height: auto;
  min-height: 100%;
  overflow: visible;
}
.separator {
  margin-left: auto;
  margin-right: auto;
}
.abstand {
  margin-bottom: 20px;
}
.bannerIcon {
  size: 30px;
}
@media (max-width: 600px) {
  .above {
    display: flex;
    justify-content: center;
    flex-direction: row;
    height: 45px;
  }
  .textOben {
    font-size: 12px;
  }
  .separatorOben {
    display: flex;
    flex-direction: row;
    top: 0;
    max-height: 8px;
  }
  .banner {
    max-height: 10px;
  }
  .bannerText {
    font-size: 12px;
  }
  .bannerIcon {
    font-size: 22px;
  }
  .img {
    max-width: 900px;
    height: 1200px;
  }
}
</style>
