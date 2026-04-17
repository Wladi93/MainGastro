<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
     <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder">IMPRESSUM</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div 
        v-for="firma in firmenName" 
        :key="firma.id" 
        class="premium-glass-card q-mb-xl shadow-24"
      >
        <div class="card-inner column items-center">
          
          <div class="text-center q-mb-lg">
            <div class="text-overline text-secondary text-weight-bold">RECHTLICHES</div>
            <div class="text-h4 text-white text-weight-bolder">Unsere Daten</div>
          </div>

  

          <div class="text-white text-center full-width q-gutter-y-sm">
            <div class="text-h6 text-secondary text-weight-bold q-mt-md">Geschäftsführer</div>
            <div class="text-body1">{{ firma.geschaeftsführerName }}</div>
            
            <q-separator dark class="q-my-sm opacity-2" />
            
            <div class="text-body2">
              {{ firma.strasse }} {{ firma.hausnummer }}<br>
              {{ firma.plz }} {{ firma.ort }}<br>
              Deutschland
            </div>

            <q-separator dark class="q-my-sm opacity-2" />

            <div class="row justify-center q-gutter-x-md">
              <div class="column">
                <span class="text-caption text-grey-5">Telefon</span>
                <a class="text-secondary text-weight-bold no-decoration" :href="'tel:' + firma.telefonnummer">
                  {{ firma.telefonnummer }}
                </a>
              </div>
              <div class="column">
                <span class="text-caption text-grey-5">E-Mail</span>
                <a class="text-secondary text-weight-bold no-decoration" :href="'mailto:' + firma.email">
                  {{ firma.email }}
                </a>
              </div>
            </div>

            <q-separator dark class="q-my-md opacity-2" />

            <div class="text-caption text-grey-4 italic">
              Kleingewerbe gemäß § 19 UStG.
            </div>
            
            <div class="text-caption q-mt-md">
              <span class="text-grey-5">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</span><br>
              <span class="text-weight-bold">{{ firma.geschaeftsführerName }}</span>
            </div>
          </div>

          <q-separator dark class="q-mt-xl q-mb-sm full-width opacity-2" />
          
          <div class="text-overline text-grey-5 text-center">
            Bei Fragen, bitte an den Geschäftsführer wenden.
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Unsere Auswahl entdecken? Zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">
          Speisekarte
        </RouterLink>
      </div>
    </div>
  </div>
  <div class="background-overlay"></div>
</template>

<script setup lang="ts">
import type { Firmenname } from "./types/SettingsFirmenNameType";
import { onMounted, ref } from "vue";
import api from "src/boot/axios";

const firmenName = ref<Firmenname[]>([]);


const loadFirmenName = async () => {
  try {
    const response = await api.get("api/firmenname/");
    firmenName.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden des Namens", error);
  }
};

onMounted(async () => {
  await loadFirmenName();

});
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
  overflow: hidden;
}

.card-inner {
  padding: 40px 30px;
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

@media (max-width: 600px) {
  .card-inner {
    padding: 30px 20px;
  }
  .text-h4 {
    font-size: 1.8rem;
  }
}
</style>