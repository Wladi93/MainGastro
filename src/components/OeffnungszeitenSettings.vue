<template>
  <q-separator class="q-mb-sm" />
  <q-list separator>
    <div v-for="oeffnungszeit in oeffnungsZeiten" :key="oeffnungszeit.id">
      <q-item-section>
        <div class="row q-mb-sm q-mt-sm" style="display: flex">
          <q-icon
            class="q-mr-sm"
            size="xs"
            color="primary"
            name="calendar_month"
          />
          <q-item-label class="text-primary">{{
            oeffnungszeit.tag
          }}</q-item-label>
        </div>
        <div
          class="row"
          style="
            display: flex;
            gap: 4em;
            justify-content: center;
            align-items: center;
          "
        >
          <div>
            <q-item-label class="q-mb-xs" caption
              >von: {{ oeffnungszeit.von }} Uhr</q-item-label
            >
            <q-input
              dense
              filled
              v-model="oeffnungszeit.von"
              mask="time"
              :rules="['time']"
              style="width: 150px"
            >
              <template v-slot:append>
                <q-icon
                  name="access_time"
                  color="primary"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="oeffnungszeit.von">
                      <q-btn
                        class="float-right q-mb-sm"
                        v-close-popup
                        label="schließen"
                        color="grey"
                        flat
                      />
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div>
            <q-item-label class="q-mb-xs" caption
              >bis: {{ oeffnungszeit.bis }} Uhr</q-item-label
            >
            <q-input
              dense
              filled
              v-model="oeffnungszeit.bis"
              mask="time"
              :rules="['time']"
              style="width: 150px"
            >
              <template v-slot:append>
                <q-icon
                  name="access_time"
                  color="primary"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="oeffnungszeit.bis">
                      <q-btn
                        class="float-right q-mb-sm"
                        v-close-popup
                        label="schließen"
                        color="grey"
                        flat
                      />
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-item-section>

      <q-separator class="q-mb-md" />
    </div>
    <q-btn
      class="full-width"
      color="secondary"
      icon="save"
      label="speichern"
      @click="updateOeffnungszeiten()"
    />
  </q-list>
</template>

<script setup lang="ts">
import { Notify } from "quasar";
import api from "src/boot/axios";
import type { Oeffnungszeiten } from "src/pages/types/OeffnungszeitenType";
import { onMounted, ref } from "vue";

const oeffnungsZeiten = ref<Oeffnungszeiten[]>([]);

const loadOeffnungszeiten = async () => {
  try {
    const response = await api.get(`/api/oeffnungszeiten`);
    oeffnungsZeiten.value = response.data;
    oeffnungsZeiten.value.sort((a, b) => {
      return a.id >= b.id ? 1 : -1;
    });
  } catch (error) {
    console.error(`Error fetching opening hours`, error);
  }
};

const updateOeffnungszeiten = async () => {
  try {
    for (const oeffnungszeit of oeffnungsZeiten.value) {
      await api.put(`/api/oeffnungszeiten/${oeffnungszeit.id}`, oeffnungszeit);
      Notify.create({
        message: "Öffnungszeiten erfolgreich aktualisiert...",
        icon: "check",
        color: "positive",
        position: "top",
      });
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Öffnungszeiten", error);
    Notify.create({
      message: "Fehler beim aktualisieren der Öffnungszeiten!",
      icon: "clear",
      color: "negative",
      position: "top",
    });
  }
};

onMounted(async () => {
  await loadOeffnungszeiten();
});
</script>
