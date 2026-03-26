<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">KONFIGURATION</div>
            <div class="text-h5 text-white text-weight-light uppercase">Bestell- & Mail-Server</div>
          </div>

          <div v-for="item in bestellMail" :key="item.id" class="q-gutter-y-lg">
            
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Mail-Server (SMTP)</div>
            
            <q-input 
              label="Bestell E-Mail" 
              dark filled 
              v-model="item.email" 
              class="premium-input"
              clearable
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              label="Passwort Email-Adresse"
              dark filled
              v-model="item.password"
              :type="isPwd ? 'password' : 'text'"
              class="premium-input"
            >
              <template v-slot:prepend><q-icon name="lock" /></template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div >
              <div >
                <q-input label="SMTP-Server" dark filled v-model="item.smtp" class="premium-input" clearable>
                  <template v-slot:prepend><q-icon name="dns" /></template>
                </q-input>
              </div>
              <div class="q-mt-lg">
                <q-input label="Port" dark filled v-model="item.port" class="premium-input" clearable>
                  <template v-slot:prepend><q-icon name="settings_input_component" /></template>
                </q-input>
              </div>
            </div>

            <q-separator dark class="q-my-lg opacity-10" />

            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Bestelloptionen & MwSt</div>

            <div class="premium-glass-card-inner q-pa-md q-mb-md" style="border-radius: 16px;">
              <div class="column q-gutter-sm">
                <q-toggle
                  v-model="item.rechnungOn"
                  label="Rechnung erstellen"
                  color="secondary"
                  dark
                  @update:model-value="(val) => { if (!val) item.rechnungSendenOn = false; }"
                />
                <q-toggle
                  :disable="!item.rechnungOn"
                  v-model="item.rechnungSendenOn"
                  label="Rechnung per Mail senden"
                  color="secondary"
                  dark
                />
                <q-toggle
                  v-model="item.liefernOn"
                  label="Liefern anbieten"
                  color="secondary"
                  dark
                />
                <q-toggle
                  v-model="item.abholenOn"
                  label="Abholen anbieten"
                  color="secondary"
                  dark
                />
              </div>
            </div>

            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <div class="row items-center no-wrap">
                   <q-toggle v-model="item.mwStOn" color="secondary" dark class="q-mr-sm" />
                   <q-input
                    :disable="!item.mwStOn"
                    type="number"
                    v-model="item.mwSt"
                    dark filled
                    label="MwSt (%)"
                    class="premium-input col"
                    prefix="%"
                  />
                </div>
              </div>
              <div class="col-12 col-sm-6" v-if="fahrkosten[0]">
                <div class="row items-center no-wrap">
                  <q-toggle v-model="fahrkosten[0].fahrkostenOn" color="secondary" dark class="q-mr-sm" />
                  <q-input
                    :disable="!fahrkosten[0].fahrkostenOn"
                    type="number"
                    v-model="vModelFahrkosten"
                    dark filled
                    label="Fahrkosten"
                    class="premium-input col"
                    prefix="€"
                  />
                </div>
              </div>
            </div>

            <q-btn
              @click="updateBestellMail(item, fahrkosten[0]!)"
              label="Einstellungen speichern"
              icon="save"
              color="secondary"
              class="luxury-btn full-width q-mt-xl"
              :loading="isLoading"
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
import { computed, onMounted, ref } from "vue";
import type {
  BestellMail,
  BestellMailResponse,
} from "src/pages/types/BestellMailType";
import { EventBus } from "src/utils/eventBus";
import type { Fahrkosten } from "src/pages/types/FahrkostenType";

const bestellMail = ref<BestellMail[]>([]);
const isPwd = ref(true);
const isLoading = ref(false);
const fahrkosten = ref<Fahrkosten[]>([]);

const vModelFahrkosten = computed({
  get() {
    return fahrkosten.value[0] ? fahrkosten.value[0].fahrkosten.toFixed(2) : "";
  },
  set(val: string) {
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && fahrkosten.value[0]) {
      fahrkosten.value[0].fahrkosten = parsed;
    }
  },
});

const loadBestellMail = async () => {
  try {
    const response = await api.get(`/api/bestellmail`);
    bestellMail.value = response.data.map((item: BestellMailResponse) => ({
      ...item,
      password: "",
    }));
  } catch (error) {
    console.error(`Error fetching bestellmail`, error);
  }
};

const updateBestellMail = async (
  mailData: BestellMail,
  fahrkostenData: Fahrkosten
) => {
  isLoading.value = true;
  try {
    await api.put(`/api/bestellmail/${mailData.id}`, mailData);
    await api.put(`/api/fahrkosten/${fahrkostenData.id}`, fahrkostenData);

    EventBus.emit("bestellmail-updated", mailData);
    EventBus.emit("fahrkosten-updated", fahrkostenData);

    Notify.create({
      message: "Daten erfolgreich gespeichert...",
      position: "top",
      color: "positive",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren", error);
    Notify.create({
      message: "Fehler beim Speichern der Daten!",
      position: "top",
      color: "negative",
      icon: "clear",
    });
  } finally {
    isLoading.value = false;
  }
};

async function loadFahrkosten() {
  try {
    const response = await api.get("/api/fahrkosten");
    fahrkosten.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Fahrkosten:", error);
  }
}

onMounted(async () => {
  await loadFahrkosten();
  await loadBestellMail();
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

.premium-glass-card-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.opacity-10 { opacity: 0.6; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>