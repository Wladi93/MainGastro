<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 ">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">CONTENT MANAGEMENT</div>
            <div class="text-h5 text-white text-weight-light uppercase">Startseite bearbeiten</div>
          </div>

          <div v-for="inhaltItem in inhalt" :key="inhaltItem.id" class="q-gutter-y-xl">
            
            <div class="section-group">
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider q-mb-lg">Haupt-Überschrift</div>
              <q-input
                v-model="inhaltItem.inhalt1"
                type="textarea"
                dark filled
                autogrow
                class="premium-input"
                placeholder="Geben Sie hier die Hauptüberschrift ein..."
              >
                <template v-slot:prepend><q-icon name="title" /></template>
              </q-input>
            </div>

<q-separator dark class="q-my-md opacity-10 q-mt-xl " />

            <div class="section-group q-mt-lg">
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider q-mb-xl">Inhalts-Blöcke</div>
              
              <div class="q-gutter-y-md">
                <q-input
                  label="Body Text 1"
                  v-model="inhaltItem.inhalt2"
                  type="textarea"
                  dark filled
                  autogrow
                  class="premium-input"
                >
                  <template v-slot:prepend><q-icon name="segment" /></template>
                </q-input>

                <q-input
                  label="Body Text 2"
                  v-model="inhaltItem.inhalt3"
                  type="textarea"
                  dark filled
                  autogrow
                  class="premium-input"
                >
                  <template v-slot:prepend><q-icon name="segment" /></template>
                </q-input>

                <q-input
                  label="Body Text 3"
                  v-model="inhaltItem.inhalt4"
                  type="textarea"
                  dark filled
                  autogrow
                  class="premium-input"
                >
                  <template v-slot:prepend><q-icon name="segment" /></template>
                </q-input>
              </div>
            </div>

            <q-btn
              icon="save"
              label="Änderungen speichern"
              color="secondary"
              class="luxury-btn full-width q-mt-xl"
              @click="updateInhalt(inhaltItem)"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Notify } from "quasar";
import api from "src/boot/axios";
import type { Inhalt } from "src/components/InhaltTypes";
import { onMounted, ref } from "vue";

const inhalt = ref<Inhalt[]>([]);

const updateInhalt = async (item: Inhalt) => {
  try {
    await api.put(`/api/inhalt/${item.id}`, item);

    Notify.create({
      message: "Daten erfolgreich gespeichert...",
      color: "positive",
      position: "top",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Inhalte", error);

    Notify.create({
      message: "Fehler beim Speichern der Daten!",
      color: "negative",
      position: "top",
      icon: "clear",
    });
  }
};

const loadInhalt = async () => {
  try {
    const response = await api.get(`/api/inhalt`);
    inhalt.value = response.data;
  } catch (error) {
    console.error(`Error fetching content`, error);
  }
};

onMounted(async () => {
  await loadInhalt();
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
  margin-top: -70px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  padding-top: 40px;
  padding-bottom: 60px;
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

.premium-input :deep(.q-field__control) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.premium-input :deep(.q-field__control:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.1);
}

.premium-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.5);
}

.luxury-btn {
  border-radius: 16px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
  letter-spacing: 1px;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
  .content-wrapper { padding-top: 20px; }
}
</style>