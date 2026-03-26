<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder">ÖFFNUNGSZEITEN</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner column items-center">
          
          <div class="text-center q-mb-lg">
            <div class="text-overline text-secondary text-weight-bold">WANN WIR DA SIND</div>
            <div class="text-h4 text-white text-weight-bolder">Öffnungszeiten</div>
          </div>

          <div class="text-white text-center full-width q-gutter-y-sm">
            <div 
              v-for="(oeffnungszeit, index) in oeffnungsZeiten" 
              :key="oeffnungszeit.id"
            >
              <div class="row justify-between items-center q-py-xs">
                <span class="text-weight-bold text-secondary text-body1">{{ oeffnungszeit.tag }}</span>
                <span class="text-body1">{{ oeffnungszeit.von }} Uhr - {{ oeffnungszeit.bis }} Uhr</span>
              </div>
              
              <q-separator 
                v-if="index < oeffnungsZeiten.length - 1" 
                dark 
                class="q-my-xs opacity-2" 
              />
            </div>

            <q-separator dark class="q-my-md opacity-2" />

            <div class="text-caption text-grey-4 italic">
              An Feiertagen gelten gesonderte Öffnungszeiten.
            </div>
          </div>

          <q-separator dark class="q-mt-xl q-mb-sm full-width opacity-2" />
          
          <div class="text-overline text-grey-5 text-center">
            Wir freuen uns auf Ihren Besuch!
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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Oeffnungszeiten } from "./types/OeffnungszeitenType";
import api from "src/boot/axios";

const oeffnungsZeiten = ref<Oeffnungszeiten[]>([]);

const loadOeffnungszeiten = async () => {
  try {
    const response = await api.get(`/api/oeffnungszeiten`);
    oeffnungsZeiten.value = response.data;
    // Sortierung beibehalten
    oeffnungsZeiten.value.sort((a, b) => {
      return a.id >= b.id ? 1 : -1;
    });
  } catch (error) {
    console.error(`Error fetching opening hours`, error);
  }
};

onMounted(async () => {
  await loadOeffnungszeiten();
});
</script>

<style scoped>
/* --- BASIS DESIGN (EXAKT WIE CODE 1) --- */
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