<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">COOKIES</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold">DATENSCHUTZ</div>
            <div class="text-h4 text-white text-weight-bolder">Cookie-Hinweise</div>
          </div>

          <div class="cookie-text text-grey-4">
            <p class="q-mb-lg">
              Wir verwenden auf dieser Website Cookies, um die Benutzererfahrung zu verbessern und bestimmte Funktionen bereitzustellen. 
              Einige Cookies werden von Drittanbietern gesetzt, wie zum Beispiel Google Maps, um Ihnen die Anfahrt zu erleichtern.
            </p>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">Welche Cookies verwenden wir?</div>
              <div class="text-weight-bold text-white q-mt-sm">Google Maps:</div>
              <p>
                Wir nutzen Google Maps für eine interaktive Karte. Google setzt Cookies, um den Standort zu speichern und Ihnen die Navigation zu erleichtern.
              </p>
              
              <div class="text-weight-bold text-white q-mt-sm">Notwendige Cookies:</div>
              <p>
                Diese sind für die Funktionalität (z.B. Kontaktformular und Bestellprozess) erforderlich. Informationen wie Ihre E-Mail-Adresse werden nur vorübergehend gespeichert.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">Welche Daten erfassen wir?</div>
              <p>
                Bei der Bestellung erfassen wir lediglich die E-Mail-Adresse zur Bestätigung. Wir speichern keine weiteren personenbezogenen Daten über Cookies.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">Speicherdauer</div>
              <p>
                Cookies für die Website-Funktionalität werden für eine kurze Dauer gespeichert und automatisch gelöscht, sobald sie nicht mehr benötigt werden.
              </p>
            </section>

            <q-separator dark class="q-my-lg opacity-2" />

            <section class="text-center">
              <div class="text-h6 text-white q-mb-sm">Einwilligung</div>
              <p class="text-caption">
                Durch die Nutzung dieser Website stimmen Sie der Verwendung von Cookies zu. 
                Sie können Ihre Einstellungen jederzeit über den Link im Footer anpassen.
              </p>
            </section>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Hungrig? Zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">
          Speisekarte
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

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
  -webkit-backdrop-filter: blur(25px);
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
  max-width: 600px;
  padding-top: 80px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
}

.card-inner {
  padding: 40px 30px;
}

.cookie-text {
  line-height: 1.6;
  text-align: left;
}

.cookie-text p {
  margin-bottom: 10px;
  font-size: 0.95rem;
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
    font-size: 1.8rem;
  }
}
</style>