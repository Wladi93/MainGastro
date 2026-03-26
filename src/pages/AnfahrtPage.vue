<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">ANFAHRT</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner column items-center">
          
          <div class="text-center q-mb-lg">
            <div class="text-overline text-secondary text-weight-bold">STANDORT</div>
            <div class="text-h4 text-white text-weight-bolder">Hier findest du uns</div>
          </div>

          <div class="map-container full-width q-mb-lg">
            <iframe
              class="google-map-iframe"
              allowfullscreen="true"
              referrerpolicy="no-referrer-when-downgrade"
              :src="embedCode"
              frameborder="0"
            ></iframe>
            <div class="text-center q-mt-xs">
              <span class="text-caption text-grey-6 italic">Powered by Google Maps</span>
            </div>
          </div>

          <div 
            v-for="firma in firmenName" 
            :key="firma.id" 
            class="text-white text-center full-width"
          >
            <div class="text-h6 text-secondary text-weight-bold">{{ firma.firmenName }}</div>
            
            <q-separator dark class="q-my-sm opacity-2" />
            
            <div class="text-body1">
              {{ firma.strasse }} {{ firma.hausnummer }}<br>
              {{ firma.plz }} {{ firma.ort }}<br>
              Deutschland
            </div>
          </div>

          <q-separator dark class="q-mt-xl q-mb-sm full-width opacity-2" />
          
          <div class="text-overline text-grey-5 text-center">
            Wir freuen uns auf deinen Besuch!
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Bestellen? Zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">
          Speisekarte
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useFirmenName } from "../composables/Firmenname";

const cookiesAccepted = ref(false);
const embedCode = ref("");
const { firmenName, loadFirmenName } = useFirmenName();

const loadExistingMap = async () => {
  try {
    const response = await api.get("/api/mapembed");
    embedCode.value = response.data.embedCode;
  } catch (error) {
    console.error("Fehler beim Laden der Karte:", error);
  }
};

onMounted(async () => {
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookiesAccepted.value = true;
  }
  await loadExistingMap();
  await loadFirmenName();
});
</script>

<style scoped>
/* --- BASIS DESIGN (IDENTISCH ZU CODE 1) --- */
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
  top: 53px; /* Beibehalten gemäß deiner Header-Position */
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
  max-width: 600px; /* Für Karte etwas breiter als beim Text */
  padding-top: 80px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
  overflow: hidden;
}

.card-inner {
  padding: 40px 30px;
}

/* --- KARTEN STYLING --- */
.map-container {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.google-map-iframe {
  width: 100%;
  height: 250px;
  display: block;
  filter: grayscale(0.2) contrast(1.1); /* Passt die Karte dezent an den Dark-Mode an */
}

.no-decoration {
  text-decoration: none;
}

.opacity-2 {
  opacity: 0.1;
}

.italic {
  font-style: italic;
}

.uppercase {
  text-transform: uppercase;
}


/* --- MOBILE OPTIMIERUNG --- */
@media (max-width: 600px) {
  .card-inner {
    padding: 25px 15px;
  }
  .text-h4 {
    font-size: 1.8rem;
  }
  .google-map-iframe {
    height: 300px;
  }
}
</style>