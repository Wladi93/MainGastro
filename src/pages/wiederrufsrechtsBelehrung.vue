<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">Widerruf</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold">RECHTLICHE HINWEISE</div>
            <div class="text-h4 text-white text-weight-bolder">Widerrufsbelehrung</div>
          </div>

          <div class="legal-text text-grey-4">
            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">Widerrufsrecht</div>
              <p>
                Sie haben das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
                Die Frist beginnt ab dem Tag, an dem Sie oder ein benannter Dritter die Waren in Besitz genommen haben.
              </p>
              <p>
                Um Ihr Recht auszuüben, informieren Sie uns bitte (<strong>[Firma Name, Adresse, E-Mail, Telefon]</strong>) 
                mittels einer eindeutigen Erklärung (z.B. Brief oder E-Mail) über Ihren Entschluss.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">Folgen des Widerrufs</div>
              <p>
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, einschließlich der Lieferkosten 
                (ausgenommen Zusatzkosten durch spezielle Lieferwünsche), unverzüglich und spätestens binnen 14 Tagen 
                ab dem Tag des Eingangs Ihres Widerrufs zurückzuzahlen.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-negative q-mb-xs">Ausschluss des Widerrufsrechts</div>
              <p class="text-weight-bold text-white">
                Wichtig bei Lebensmitteln:
              </p>
              <p>
                Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die schnell verderben können 
                oder deren Verfallsdatum schnell überschritten würde (z.B. frisch zubereitete Speisen).
              </p>
            </section>

            <section class="q-mb-lg muster-box q-pa-md">
              <div class="text-subtitle1 text-white text-weight-bold q-mb-sm">Muster-Widerrufsformular</div>
              <div class="text-caption text-grey-5">
                (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus:)
                <br><br>
                An: [Name, Adresse, E-Mail des Unternehmens]<br>
                Hiermit widerrufe(n) ich/wir den Vertrag über den Kauf der folgenden Waren:<br>
                Bestellt am: __________ / erhalten am: __________<br>
                Name des Verbrauchers: ____________________<br>
                Anschrift: ________________________________<br>
                Datum & Unterschrift: ______________________
              </div>
            </section>

            <q-separator dark class="q-my-lg opacity-2" />
            
            <div class="text-caption text-grey-6 italic">
              Stand: Februar 2025
            </div>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Doch lieber etwas bestellen? zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">Speisekarte</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
}

.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  top: 53px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.content-wrapper {
  width: 100%;
  max-width: 650px;
  padding-top: 100px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
}

.card-inner {
  padding: 40px;
}

.legal-text {
  line-height: 1.6;
  text-align: left;
}

.muster-box {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.no-decoration {
  text-decoration: none;
}

.opacity-2 {
  opacity: 0.1;
}

.uppercase {
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .card-inner {
    padding: 30px 20px;
  }
  .text-h4 {
    font-size: 1.7rem;
  }
}
</style>