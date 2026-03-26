<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">DATENSCHUTZ</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold">PRIVACY POLICY</div>
            <div class="text-h4 text-white text-weight-bolder">Datenschutzerklärung</div>
          </div>

          <div class="ds-text text-grey-4">
            <p class="q-mb-lg italic">
              Der Schutz deiner personenbezogenen Daten ist uns sehr wichtig. Nachfolgend informieren wir dich ausführlich über die Verarbeitung deiner Daten im Zusammenhang mit der Nutzung unserer Webseite.
            </p>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">1. Verantwortlicher</div>
              <p>
                Verantwortlicher für die Datenverarbeitung auf dieser Webseite ist:<br>
                <strong>[Dein Unternehmen]</strong><br>
                [Adresse]<br>
                [E-Mail-Adresse]<br>
                [Telefonnummer]
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">2. Erhebung von Daten</div>
              <p>
                Wir erheben Daten, die du uns zur Verfügung stellst:
                <ul class="q-pl-md">
                  <li><strong>Bestelldaten:</strong> Name, Adresse, E-Mail, Telefonnummer, Zahlungsinformationen.</li>
                  <li><strong>Nutzungsdaten:</strong> IP-Adresse, Browsertyp, Zugriffszeiten.</li>
                  <li><strong>Kommunikation:</strong> Anfragen über das Kontaktformular.</li>
                </ul>
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">3. Zwecke der Verarbeitung</div>
              <p>
                Die Verarbeitung erfolgt zur Abwicklung von Bestellungen, zur Vertragserfüllung, zur Verbesserung der Webseite und zur Kommunikation bei Rückfragen.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">4. Weitergabe an Dritte</div>
              <p>
                Daten werden nur an notwendige Dienstleister (Versand, Zahlung) weitergegeben. 
                Bei Nutzung von <strong>Google Maps</strong> werden Daten (inkl. IP-Adresse) an Google übertragen. Infos dazu unter: 
                <a href="https://policies.google.com/privacy" target="_blank" class="text-secondary">Google Privacy</a>.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">5. Speicherdauer</div>
              <p>
                Wir speichern Daten nur so lange, wie es für die Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">6. Deine Rechte</div>
              <p>
                Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Du kannst deine Einwilligung jederzeit widerrufen. Kontaktier uns dazu unter: <strong>[E-Mail-Adresse]</strong>.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">7. Datensicherheit</div>
              <p>
                Wir treffen technische Maßnahmen, um deine Daten vor Missbrauch und unbefugtem Zugriff zu schützen.
              </p>
            </section>

            <q-separator dark class="q-my-lg opacity-2" />
            
            <div class="text-caption text-grey-6 italic">
              Stand: Februar 2025
            </div>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Zurück zum Genuss? zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">Speisekarte</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* --- BASIS DESIGN (KONSISTENT ZU ALLEN SEITEN) --- */
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
  max-width: 700px; /* Etwas breiter für besseren Lesefluss langer Texte */
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
  padding: 40px;
}

/* --- TEXT STYLING --- */
.ds-text {
  line-height: 1.6;
  text-align: left;
}

.ds-text p {
  margin-bottom: 15px;
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

.italic {
  font-style: italic;
}

/* --- MOBILE OPTIMIERUNG --- */
@media (max-width: 600px) {
  .card-inner {
    padding: 30px 20px;
  }
  .text-h4 {
    font-size: 1.6rem;
  }
}
</style>