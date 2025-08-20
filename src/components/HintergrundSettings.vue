<template>
  <q-item-label>Hintergrund-Motive:</q-item-label>

  <q-list v-for="hintergrunde in hintergrund" :key="hintergrunde.id">
    <q-item-section>
      <q-separator class="q-my-sm" />
      <q-item-label class="q-mb-xs" caption
        >{{ hintergrunde.name }}:</q-item-label
      >
      <q-item-section class="relative flex">
        <iframe
          :src="baseUrlCss + hintergrunde.vorschau"
          frameborder="0"
          @load="onIframeLoad(hintergrunde.id)"
          style="opacity: 0; transition: opacity 0.3s; border-radius: 4px"
          :style="{ opacity: loadingStates[hintergrunde.id] ? 0 : 1 }"
        ></iframe>
        <q-inner-loading
          class="innerLoad relative-position"
          :showing="loadingStates[hintergrunde.id]"
        />
      </q-item-section>
      <aside>
        <q-btn
          :text-color="hintergrunde.isActive ? 'positive' : ''"
          :label="hintergrunde.isActive ? 'ausgewählt' : 'auswählen'"
          class="full-width q-mt-sm q-mb-xs"
          color="secondary"
          :data-stylesheet="hintergrunde.cssName"
          @click="setActiveStylesheet(hintergrunde.id)"
        >
          <q-icon
            color="positive"
            name="task_alt"
            class="q-ml-sm"
            v-if="hintergrunde.isActive"
          />
        </q-btn>
      </aside>
    </q-item-section>
  </q-list>
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import type { Hintergrund } from "src/pages/types/HintergrundType";
import { onMounted, ref, reactive } from "vue";

const currentDomain = window.location.hostname;
const baseUrlCss = `http://${currentDomain}:9000/#/`;
const hintergrund = ref<Hintergrund[]>([]);
const apiLoading = ref(false);
const loadingStates = reactive<Record<number, boolean>>({});

const loadHintergrund = async () => {
  apiLoading.value = true;
  try {
    const response = await api.get(`/api/hintergrund`);
    hintergrund.value = response.data;
    hintergrund.value.sort((a, b) => {
      return a.name >= b.name ? 1 : -1;
    });
    hintergrund.value.forEach((item) => {
      loadingStates[item.id] = true;
    });

    apiLoading.value = false;
  } catch (error) {
    console.error(error);
    apiLoading.value = false;
  }
};

const onIframeLoad = (id: number) => {
  loadingStates[id] = false;
};

const setActiveStylesheet = async (id: number) => {
  try {
    await api.post("/api/hintergrund/active", id, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    location.reload();
  } catch (error) {
    console.error("Fehler beim Setzen des aktiven CSS", error);
  }
};

onMounted(async () => {
  await loadHintergrund();
});
</script>
<style>
.innerLoad {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  justify-self: center;
  margin-top: -170px;
}
</style>
