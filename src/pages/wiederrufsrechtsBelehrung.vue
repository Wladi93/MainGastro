<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="fact_check" class="bannerIcon" />
      Widerrufsbelehrung
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      unsere Widerrufsbelehrung ...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>
  <q-img class="background-img" />
  <q-card class="my-card q-mt-md">
    <q-img class="img" src="./images/document.jpg">
      <div class="text text-subtitle2 absolute-top text-center">
        <h6>Widerrufsrecht</h6>
        <q-separator inset class="q-mb-lg bg-grey-8" size="2px" />
        <h6 class="text-body2">
          Sie haben das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen
          den Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem
          Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der
          Beförderer ist, die Waren in Besitz genommen haben. Um Ihr
          Widerrufsrecht auszuüben, müssen Sie uns (Firma Name, Adresse,
          E-Mail-Adresse, Telefonnummer) mittels einer eindeutigen Erklärung (z.
          B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren
          Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
          dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch
          nicht vorgeschrieben ist.
        </h6>
        <p></p>
        <h6>Folgen des Widerrufs</h6>
        <h6 class="text-body2">
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
          die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
          Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie
          eine andere Art der Lieferung als die von uns angebotene, günstigste
          Standardlieferung gewählt haben), unverzüglich und spätestens binnen
          14 Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf dieses
          Vertrags bei uns eingegangen ist, zurückzuzahlen. Für diese
          Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
          ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen
          wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden
          Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </h6>
        <p></p>
        <h6>Ausschluss des Widerrufsrechts</h6>
        <h6 class="text-body2">
          Das Widerrufsrecht besteht nicht bei Verträgen: zur Lieferung von
          Waren, die schnell verderben können oder deren Verfallsdatum schnell
          überschritten würde, zur Lieferung von versiegelten Waren, die aus
          Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe
          geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt
          wurde.
        </h6>
        <p></p>
        <h6>Muster-Widerrufsformular</h6>
        <h6 class="text-body2">
          (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
          Formular aus und senden Sie es zurück.) An [Name, Adresse, E-Mail des
          Unternehmens]: Hiermit widerrufe(n) ich/wir den Vertrag über den Kauf
          der folgenden Waren: Bestellt am / erhalten am: Name des/der
          Verbraucher(s): Anschrift des/der Verbraucher(s): Unterschrift des/der
          Verbraucher(s) (nur bei Mitteilung auf Papier): Datum:
        </h6>
        <p></p>
        <h6>Stand: Februar 2025</h6>
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
  background-image: url("./images/document.jpg");
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
    height: 1300px;
  }
}
</style>
