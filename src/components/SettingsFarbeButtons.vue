<script setup lang="ts">
import { onMounted, watch } from "vue";
import { setCssVar } from "quasar";
import api from "src/boot/axios";

const isOpen = defineModel<boolean>("isOpen", { default: false });
const colorButtons = defineModel<string>("colorButtons", {
  required: true,
});

const loadColor = async () => {
  try {
    const res = await api.get("api/color/2");

    if (res.data && res.data.color) {
      colorButtons.value = res.data.color;
      setCssVar("secondary", colorButtons.value);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Farbe", error);
  }
};

const saveColor = async (newColor: string, id: number) => {
  try {
    await api.put("api/color/2", { id, color: newColor });
  } catch (error) {
    console.error("Fehler beim speichern der Farbe", error);
  }
};

watch(colorButtons, async (newVal) => {
  setCssVar("secondary", newVal);
  await saveColor(newVal, 2);
});

onMounted(async () => {
  await loadColor();
});
</script>

<template>
  <q-dialog v-model="isOpen">
    <q-card
      class="q-mt-md"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 80vw;
        min-height: 50vh;
        max-height: 70vh;
      "
    >
      <q-color
        style="min-width: 80vw; min-height: 50vh; max-height: 70vh"
        :model-value="colorButtons"
        @change="
          (val) => {
            colorButtons = val;
          }
        "
      />
    </q-card>
  </q-dialog>
</template>
