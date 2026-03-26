<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">AGB's</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold">RECHTLICHES</div>
            <div class="text-h4 text-white text-weight-bolder">Unsere AGB's</div>
          </div>

          <div class="agb-text text-grey-4">
            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">1. Geltungsbereich</div>
              <p>
                (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, 
                die über die Website <strong>[Deine Webseite]</strong> (nachfolgend "Online-Shop" genannt) getätigt werden. 
                (2) Vertragspartner des Kunden ist [Dein Unternehmensname], [Rechtsform des Unternehmens], [Adresse], 
                [Telefonnummer], [E-Mail-Adresse], [Handelsregister-Nr.], [USt-IdNr.].
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">2. Vertragsabschluss</div>
              <p>
                (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Bestellung. 
                (2) Der Kunde gibt durch das Absenden der Bestellung im Online-Shop ein verbindliches Angebot zum Kauf der ausgewählten Waren ab. 
                Der Vertrag kommt erst zustande, wenn der Anbieter das Angebot des Kunden durch eine Bestellbestätigung oder Lieferung der Ware annimmt. 
                (3) Die Bestellbestätigung erfolgt per E-Mail, unmittelbar nach Eingang der Bestellung.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">3. Bestellvorgang</div>
              <p>
                (1) Der Kunde kann aus dem Sortiment im Online-Shop Produkte auswählen und diese über den Button „Bestellen“ in den Warenkorb legen. 
                (2) Der Kunde gibt seine Bestellinformationen (wie Name, Adresse, Zahlungsmethode) ein und schließt die Bestellung ab. 
                (3) Die Bestellung wird nach Abschluss des Bestellvorgangs sofort an das System des Anbieters übermittelt.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">4. Preise und Zahlungsbedingungen</div>
              <p>
                (1) Alle angegebenen Preise sind Endpreise in Euro und beinhalten die gesetzliche Mehrwertsteuer. 
                (2) Die Zahlung erfolgt per Online-Zahlung über das Zahlungssystem SumUp. Die Zahlung ist mit der Bestellung fällig. 
                (3) Der Anbieter behält sich das Recht vor, Bestellungen bei unklarer Zahlung zu stornieren.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">5. Lieferung</div>
              <p>
                (1) Die Lieferung erfolgt nur innerhalb des Liefergebiets, das im Online-Shop angegeben wird. 
                (2) Die Lieferung erfolgt durch den Anbieter oder einen Dritten. Die Lieferzeit wird während des Bestellvorgangs mitgeteilt.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">6. Widerrufsrecht</div>
              <p>
                (1) Aufgrund der Art der angebotenen Produkte (Lebensmittel) besteht kein Widerrufsrecht gemäß § 312g Abs. 2 Nr. 2 BGB. 
                (2) Im Falle einer falschen oder beschädigten Lieferung kontaktieren Sie uns bitte umgehend.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">7. Haftung</div>
              <p>
                (1) Der Anbieter haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen. 
                (2) Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, außer im Fall der Verletzung von Leben, Körper oder Gesundheit.
              </p>
            </section>

            <section class="q-mb-lg">
              <div class="text-h6 text-secondary q-mb-xs">8. Datenschutz</div>
              <p>
                (1) Der Anbieter erhebt Daten nur zur Abwicklung der Bestellung unter Beachtung der DSGVO. 
                Weitere Informationen finden Sie in unserer Datenschutzerklärung.
              </p>
            </section>

            <q-separator dark class="q-my-lg opacity-2" />
            
            <div class="text-caption text-grey-6 italic">
              Stand der AGB: Februar 2025
            </div>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Fragen? <RouterLink class="text-secondary text-weight-bold no-decoration" to="/kontakt">Kontaktieren Sie uns</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Keine spezielle Logik erforderlich
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

/* --- TEXT STYLING --- */
.agb-text {
  line-height: 1.6;
  text-align: left;
}

.agb-text p {
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
    font-size: 1.8rem;
  }
}
</style>