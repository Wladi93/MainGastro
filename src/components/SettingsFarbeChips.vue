<script setup lang="ts">
import { onMounted, watch } from "vue";
import { setCssVar } from "quasar";
import api from "src/boot/axios";

const isOpen = defineModel<boolean>("isOpen", { default: false });
const colorChips = defineModel<string>("colorChips", {
  required: true,
});

const loadColor = async () => {
  try {
    const res = await api.get("api/color/3");

    if (res.data && res.data.color) {
      colorChips.value = res.data.color;
      setCssVar("info", colorChips.value);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Farbe", error);
  }
};

const saveColor = async (newColor: string, id: number) => {
  try {
    await api.put("api/color/3", { id, color: newColor });
  } catch (error) {
    console.error("Fehler beim speichern der Farbe", error);
  }
};

watch(colorChips, async (newVal) => {
  setCssVar("info", newVal);
  await saveColor(newVal, 3);
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
        :model-value="colorChips"
        @change="
          (val) => {
            colorChips = val;
          }
        "
      />
    </q-card>
  </q-dialog>
</template>
