<template>
  <div class="app-container">
    <div class="glass-header">
      <div class="categories-nav q-pa-md">
        <div 
          v-for="t in tabsList"
          :key="t.name"
          @click="tab = t.name"
          class="nav-pill"
          :class="{ 'pill-active': tab === t.name }"
        >
          <q-icon :name="t.icon" size="xs" class="q-mr-xs" />
          {{ t.label }}
        </div>
      </div>
    </div>

    <div class="content-body">
      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="allgemein" class="q-pa-none">
          <AllgemeinSettings />
        </q-tab-panel>

        <q-tab-panel name="inhalt" class="q-pa-none">
          <InhaltSettings />
        </q-tab-panel>

        <q-tab-panel name="logos" class="q-pa-none">
          <LogosSettings />
        </q-tab-panel>

        <q-tab-panel name="beilagen" class="q-pa-none">
          <BeilagenSettings />
        </q-tab-panel>

        <q-tab-panel name="kontakt" class="q-pa-none">
          <KontaktSettings />
        </q-tab-panel>

        <q-tab-panel name="anfahrt" class="q-pa-none">
          <AnfahrtSettings />
        </q-tab-panel>

        <q-tab-panel name="oeffnungszeiten" class="q-pa-none">
          <OeffnungszeitenSettings />
        </q-tab-panel>

        <q-tab-panel name="bestellung" class="q-pa-none">
          <BestellMailSettings />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AllgemeinSettings from "src/components/AllgemeinSettings.vue";
import InhaltSettings from "src/components/InhaltSettings.vue";
import LogosSettings from "src/components/LogosSettings.vue";
import KontaktSettings from "src/components/KontaktSettings.vue";
import AnfahrtSettings from "src/components/AnfahrtSettings.vue";
import OeffnungszeitenSettings from "src/components/OeffnungszeitenSettings.vue";
import BestellMailSettings from "src/components/BestellMailSettings.vue";
import BeilagenSettings from "src/components/BeilagenSettings.vue";

const tab = ref("allgemein");

const tabsList = [
  { name: 'allgemein', label: 'Allgemein', icon: 'description' },
  { name: 'inhalt', label: 'Inhalt', icon: 'format_align_center' },
  { name: 'logos', label: 'Logos', icon: 'image' },
  { name: 'beilagen', label: 'Beilagen', icon: 'cookie' },
  { name: 'kontakt', label: 'Kontaktdaten', icon: 'contact_mail' },
  { name: 'anfahrt', label: 'Anfahrt', icon: 'place' },
  { name: 'oeffnungszeiten', label: 'Öffnungszeiten', icon: 'schedule' },
  { name: 'bestellung', label: 'Bestellung', icon: 'attach_email' }
];
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  padding-top: 60px;
  width: 100%;
}

/* --- GLASS HEADER --- */
.glass-header {
  position: -webkit-sticky; 
  position: sticky;
  top: 60px; 
  z-index: 2000; 
  background: rgba(10, 10, 10, 0.85); 
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.content-body {
  padding-top: 10px;
  width: 100%;
}

/* --- NAV PILLS --- */
.categories-nav {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scrollbar-width: none;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch; 
}

.categories-nav::-webkit-scrollbar { 
  display: none; 
}

.nav-pill {
  padding: 8px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pill-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-color: var(--q-secondary);
  box-shadow: 0 0 15px rgba(var(--q-secondary), 0.15);
}

.q-tab-panels {
  background: transparent !important;
}

@media (max-width: 600px) {
  .nav-pill {
    padding: 6px 14px;
    font-size: 13px;
  }
}
</style>