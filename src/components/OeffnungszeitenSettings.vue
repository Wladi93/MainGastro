<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">ZEITPLAN</div>
            <div class="text-h5 text-white text-weight-light uppercase">Öffnungszeiten</div>
          </div>

          <div class="q-gutter-y-lg">
            <div v-for="oeffnungszeit in oeffnungsZeiten" :key="oeffnungszeit.id" class="oeffnungs-row">
              
              <div class="row items-center q-mb-sm">
                <q-icon
                  class="q-mr-sm"
                  size="xs"
                  color="secondary"
                  name="calendar_month"
                />
                <div class="text-subtitle1 text-white text-weight-medium">
                  {{ oeffnungszeit.tag }}
                </div>
              </div>

              <div class="row q-col-gutter-md items-center">
                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    dark
                    filled
                    v-model="oeffnungszeit.von"
                    mask="time"
                    :rules="['time']"
                    label="Von (Uhr)"
                    class="premium-input no-bottom-space"
                  >
                    <template v-slot:prepend>
                      <q-icon name="access_time" color="secondary" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="edit" size="xs" color="grey-5" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="oeffnungszeit.von" color="secondary">
                            <div class="row items-center justify-end q-gutter-sm">
                              <q-btn label="schließen" color="white" flat v-close-popup />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    dark
                    filled
                    v-model="oeffnungszeit.bis"
                    mask="time"
                    :rules="['time']"
                    label="Bis (Uhr)"
                    class="premium-input no-bottom-space"
                  >
                    <template v-slot:prepend>
                      <q-icon name="access_time" color="secondary" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="edit" size="xs" color="grey-5" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="oeffnungszeit.bis" color="secondary">
                            <div class="row items-center justify-end q-gutter-sm">
                              <q-btn label="schließen" color="white" flat v-close-popup />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <q-separator dark class="q-mt-lg opacity-10" />
            </div>

            <q-btn
              class="luxury-btn full-width q-mt-xl"
              color="secondary"
              icon="save"
              label="Öffnungszeiten speichern"
              @click="updateOeffnungszeiten()"
              :text-color="schriftFarbe ? 'white' : 'black'"
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
    }
    Notify.create({
      message: "Öffnungszeiten erfolgreich aktualisiert...",
      icon: "check",
      color: "positive",
      position: "top",
    });
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

const schriftFarbe = ref<boolean>(false);

  async function loadSchriftFarbe() {
  try {
    const res = await api.get("api/color/2");
    if (res.data) {
      schriftFarbe.value = Boolean(res.data.schriftFarbe);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Schriftfarbe", error);
  }
}

onMounted(async () => {
  await loadOeffnungszeiten();
  await loadSchriftFarbe();
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
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.premium-input :deep(.q-field__native),
.premium-input :deep(.q-field__prefix),
.premium-input :deep(.q-field__suffix),
.premium-input :deep(.q-field__input) {
  color: white;
}

.no-bottom-space :deep(.q-field__bottom) {
  display: none;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.opacity-10 {
  opacity: 0.6;
}

.tracking-widest { letter-spacing: 3px; }
.uppercase { text-transform: uppercase; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>