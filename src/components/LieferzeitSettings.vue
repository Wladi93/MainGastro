<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Lieferzeit einstellen</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="isOpen = false" />
      </q-card-section>

      <q-card-section>
        <div v-if="lieferzeit && lieferzeit.length > 0">
          <div class="q-gutter-md">
            <q-input
              v-model.number="lieferzeit[0]!.stunden"
              label="Stunden"
              type="number"
              min="0"
              max="23"
              outlined
            />
            <q-input
              v-model.number="lieferzeit[0]!.minuten"
              label="Minuten"
              type="number"
              min="0"
              max="59"
              outlined
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Abbrechen" color="grey" flat @click="isOpen = false" />
        <q-btn label="Speichern" color="secondary" @click="updateLieferzeit" />
      </q-card-actions>
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
