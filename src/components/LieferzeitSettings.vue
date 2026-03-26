<template>
  <q-dialog v-model="isOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card class="premium-glass-card shadow-24 custom-dialog-width">
      <q-card-section class="q-pa-none relative-position">
        <q-btn 
          icon="close" 
          flat 
          round 
          dense 
          class="absolute-top-right q-ma-md text-white z-top" 
          @click="isOpen = false" 
        />

        <div class="card-inner">
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">EINSTELLUNGEN</div>
            <div class="text-h5 text-white text-weight-light uppercase">Lieferzeit einstellen</div>
          </div>

          <div v-if="lieferzeit && lieferzeit.length > 0">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider q-mb-xl">Zeitkonfiguration</div>
            
            <div class="q-gutter-y-lg">
              <q-input
                v-model.number="lieferzeit[0]!.stunden"
                label="Stunden"
                type="number"
                min="0"
                max="23"
                dark
                filled
                class="premium-input"
              >
                <template v-slot:prepend><q-icon name="schedule" /></template>
              </q-input>

              <q-input
                v-model.number="lieferzeit[0]!.minuten"
                label="Minuten"
                type="number"
                min="0"
                max="59"
                dark
                filled
                class="premium-input"
              >
                <template v-slot:prepend><q-icon name="timer" /></template>
              </q-input>
            </div>
          </div>

          <div class="row q-gutter-md q-mt-lg">
            <q-btn 
              flat 
              label="Abbrechen" 
              color="white" 
              class="luxury-btn-outline col" 
              @click="isOpen = false" 
            />
            <q-btn 
              label="Speichern" 
              color="secondary" 
              class="luxury-btn col" 
              icon="save"
              @click="updateLieferzeit" 
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import type { Lieferzeit } from "src/pages/types/LieferzeitType";
import { onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const lieferzeit = defineModel<Lieferzeit[]>("lieferzeit");
const isOpen = defineModel<boolean>("isOpen", { required: true });

async function loadLieferzeit() {
  try {
    const response = await api.get(`/api/lieferzeit`);
    lieferzeit.value = response.data;
  } catch (error) {
    console.error("Lieferzeit konnte nicht geladen werden", error);
  }
}

async function updateLieferzeit() {
  try {
    if (lieferzeit.value && lieferzeit.value[0]) {
      if (!lieferzeit.value[0].minuten) {
        lieferzeit.value[0].minuten = 0;
      }
      if (!lieferzeit.value[0].stunden) {
        lieferzeit.value[0].stunden = 0;
      }

      await api.put(
        `/api/lieferzeit/${lieferzeit.value[0].id}`,
        lieferzeit.value[0]
      );

      $q.notify({
        type: "positive",
        position: "top",
        message: "Lieferzeit erfolgreich gespeichert",
      });
      isOpen.value = false;
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Lieferzeit", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Speichern der Lieferzeit",
    });
  }
}

onMounted(async () => {
  await loadLieferzeit();
});
</script>

<style scoped>
/* Design-Elemente von Code 2 */
.premium-glass-card {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
  overflow: hidden;
}

.custom-dialog-width {
  width: 450px;
  max-width: 95vw;
}

.card-inner {
  padding: 40px 30px;
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.premium-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.5);
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.luxury-btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  height: 55px;
  color: white;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>