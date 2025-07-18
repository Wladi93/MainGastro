<template>
  <q-item-label>Startseite:</q-item-label>
  <q-separator class="q-my-sm" />
  <q-list v-for="inhalt in inhalt" :key="inhalt.id">
    <q-item-section>
      <q-item-label class="q-mb-sm" caption> Überschrift: </q-item-label>
      <q-input type="textarea" filled v-model="inhalt.inhalt1"></q-input>
    </q-item-section>

    <q-separator class="q-my-md" />

    <q-item-section>
      <q-item-label class="q-mb-sm" caption> Body 1: </q-item-label>
      <q-input type="textarea" filled v-model="inhalt.inhalt2"></q-input>
    </q-item-section>

    <q-separator class="q-my-md" />

    <q-item-section>
      <q-item-label class="q-mb-sm" caption> Body 2: </q-item-label>
      <q-input type="textarea" filled v-model="inhalt.inhalt3"></q-input>
    </q-item-section>

    <q-separator class="q-my-md" />

    <q-item-section>
      <q-item-label class="q-mb-sm" caption> Body 3: </q-item-label>
      <q-input type="textarea" filled v-model="inhalt.inhalt4"></q-input>
    </q-item-section>

    <q-separator class="q-my-md" />

    <q-btn
      class="full-width"
      label="speichern"
      icon="save"
      color="secondary"
      @click="updateInhalt(inhalt)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { Notify } from "quasar";
import api from "src/boot/axios";
import type { Inhalt } from "src/components/InhaltTypes";
import { onMounted, ref } from "vue";

const inhalt = ref<Inhalt[]>([]);

const updateInhalt = async (inhalt: Inhalt) => {
  try {
    await api.put(`/api/inhalt/${inhalt.id}`, inhalt);

    Notify.create({
      message: "Daten erflogreich gespeichert...",
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
    console.error(`Error fetching opening hours`, error);
  }
};

onMounted(async () => {
  await loadInhalt();
});
</script>
