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
        :model-value="color1"
        @change="
          (val) => {
            color1 = val;
          }
        "
      />
    </q-card>
  </q-dialog>
</template>


<script setup lang="ts">
import { onMounted, watch } from "vue";
import { setCssVar } from "quasar";
import api from "src/boot/axios";

const isOpen = defineModel<boolean>("isOpen", { default: false });
const color1 = defineModel<string>("color1", {
  required: true,
});

const loadColor = async () => {
  try {
    const res = await api.get("api/color/1");

    if (res.data && res.data.color) {
      color1.value = res.data.color;
      setCssVar("primary", color1.value);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Farbe", error);
  }
};

const saveColor = async (newColor: string, id: number) => {
  try {
    await api.put("api/color/1", { id, color: newColor });
  } catch (error) {
    console.error("Fehler beim speichern der Farbe", error);
  }
};

watch(color1, async (newVal) => {
  setCssVar("primary", newVal);
  await saveColor(newVal, 1);
});

onMounted(async () => {
  await loadColor();
});
</script>

