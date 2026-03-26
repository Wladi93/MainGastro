<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">KÜCHE</div>
            <div class="text-h5 text-white text-weight-light uppercase">Beilagen & Saucen</div>
          </div>

          <q-list>
            <q-item-label class="q-mb-sm text-grey-5 uppercase tracking-wider" caption>Beilagen hinzufügen:</q-item-label>
            <q-input
              label="bitte Name eingeben"
              dark filled
              v-model="beilage"
              class="premium-input"
              @keyup.enter="postBeilage()"
            />
            <q-btn
              :disable="beilage.length == 0"
              label="speichern"
              icon="save"
              color="secondary"
              class="luxury-btn full-width q-mt-sm"
              @click="postBeilage()"
            />

            <q-expansion-item
              class="q-mt-sm premium-expansion"
              icon="list"
              label="angelegte Beilagen"
              header-class="text-white"
            >
              <div class="q-mt-md q-pa-sm">
                <q-list v-for="beilageNamen in beilageName" :key="beilageNamen.id">
                  <q-chip class="q-ml-md premium-chip" dense outline color="secondary">
                    {{ beilageNamen.beilageName }}
                    <q-btn
                      dense
                      round
                      flat
                      size="xs"
                      icon="close"
                      color="grey"
                      @click.stop="deleteBeilage(beilageNamen.id)"
                    />
                  </q-chip>
                </q-list>
              </div>
            </q-expansion-item>

            <q-separator dark class="q-my-md opacity-10" />

            <q-item-label class="q-mb-sm text-grey-5 uppercase tracking-wider" caption>Saucen hinzufügen:</q-item-label>

            <q-input
              label="bitte Name eingeben"
              dark filled
              v-model="sauce"
              class="premium-input"
              @keyup.enter="postSauce()"
            />
            <q-btn
              :disable="sauce.length == 0"
              label="speichern"
              icon="save"
              color="secondary"
              class="luxury-btn full-width q-mt-sm"
              @click="postSauce()"
            />

            <q-expansion-item
              class="q-mt-sm premium-expansion"
              icon="list"
              label="angelegte Saucen"
              header-class="text-white"
            >
              <div class="q-mt-md q-pa-sm">
                <q-list v-for="sauce in saucenName" :key="sauce.id">
                  <q-chip class="q-ml-md premium-chip" dense outline>
                    {{ sauce.name }}
                    <q-btn
                      dense
                      round
                      flat
                      size="xs"
                      icon="close"
                      color="grey"
                      @click.stop="deleteSauce(sauce.id)"
                    />
                  </q-chip>
                </q-list>
              </div>
            </q-expansion-item>

        
          </q-list>

                <q-separator dark class="q-my-md opacity-10" />

            <q-item-label class="q-mb-sm text-grey-5 uppercase tracking-wider" caption>Preise Beilagen:</q-item-label>

            <q-input prefix="€" dark filled label="Preis für Klein:" v-model="preisKlein" class="premium-input" />

            <q-input
              class="q-mt-sm premium-input"
              dark filled
              label="Preis für Mittel:"
              v-model="preisMittel"
              prefix="€"
            />

            <q-input
              prefix="€"
              class="q-mt-sm premium-input"
              dark filled
              label="Preis für Groß:"
              v-model="preisGross"
            />

            <q-input
              prefix="€"
              class="q-mt-sm premium-input"
              dark filled
              label="Preis für Familie:"
              v-model="preisFamilie"
            />

          <q-btn
              @click="updateBeilagenPreise()"
              color="secondary"
              label="speichern"
              icon="save"
              class="luxury-btn full-width q-mt-md"
            />

            
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import { computed, onMounted, ref } from "vue";
import type {
  BeilagenName,
  BeilagenPreise,
} from "src/pages/types/BeilagenType";
import { Notify } from "quasar";
import type { SaucenType } from "src/pages/types/SaucenType";

const beilage = ref("");
const beilageName = ref<BeilagenName[]>([]);
const beilagenPreise = ref<BeilagenPreise[]>([]);
const sauce = ref("");
const saucenName = ref<SaucenType[]>([]);

const preisKlein = computed({
  get() {
    return beilagenPreise.value[0]
      ? beilagenPreise.value[0].kleinpreis.toFixed(2)
      : "";
  },
  set(val: string) {
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && beilagenPreise.value[0]) {
      beilagenPreise.value[0].kleinpreis = parsed;
    }
  },
});

const preisMittel = computed({
  get() {
    return beilagenPreise.value[0]
      ? beilagenPreise.value[0].mittelpreis.toFixed(2)
      : "";
  },
  set(val: string) {
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && beilagenPreise.value[0]) {
      beilagenPreise.value[0].mittelpreis = parsed;
    }
  },
});

const preisGross = computed({
  get() {
    return beilagenPreise.value[0]
      ? beilagenPreise.value[0].grosspreis.toFixed(2)
      : "";
  },
  set(val: string) {
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && beilagenPreise.value[0]) {
      beilagenPreise.value[0].grosspreis = parsed;
    }
  },
});

const preisFamilie = computed({
  get() {
    return beilagenPreise.value[0]
      ? beilagenPreise.value[0].familiepreis.toFixed(2)
      : "";
  },
  set(val: string) {
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && beilagenPreise.value[0]) {
      beilagenPreise.value[0].familiepreis = parsed;
    }
  },
});

async function loadBeilagen() {
  try {
    const response = await api.get("/api/beilagen/beilagenname");
    beilageName.value = response.data;
    const responsePreise = await api.get("/api/beilagen/beilagenpreise");
    beilagenPreise.value = responsePreise.data;
  } catch (error) {
    console.error("Fehler beim Laden der Fahrkosten:", error, beilageName);
  }
}

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    saucenName.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Saucen", error);
  }
}

const postBeilage = async () => {
  try {
    const newBeilage = { beilageName: beilage.value };
    if (beilage.value.length == 0) return;
    await api.post(`/api/beilagen/beilagenname`, newBeilage);
    beilage.value = "";
    await loadBeilagen();
    Notify.create({
      message: "Daten erfolgreich gespeichert...",
      position: "top",
      color: "positive",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Kontakt-Daten", error);
    Notify.create({
      message: "Fehler beim Speichern der Daten!",
      position: "top",
      color: "negative",
      icon: "clear",
    });
  }
};

const postSauce = async () => {
  try {
    const newSauce = { name: sauce.value };
    if (sauce.value.length == 0) return;
    await api.post("/api/saucen", newSauce);
    sauce.value = "";
    await loadSaucen();
  } catch (error) {
    console.error("Fehler beim speichern der Sauce", error);
    Notify.create({
      message: "Fehler beim Speichern der Daten!",
      position: "top",
      color: "negative",
      icon: "clear",
    });
  }
};

const updateBeilagenPreise = async () => {
  const beilagenPreis = {
    id: beilagenPreise.value[0]?.id,
    kleinpreis: beilagenPreise.value[0]!.kleinpreis,
    mittelpreis: beilagenPreise.value[0]!.mittelpreis,
    grosspreis: beilagenPreise.value[0]!.grosspreis,
    familiepreis: beilagenPreise.value[0]!.familiepreis,
  };
  try {
    await api.put(`/api/beilagen/beilagenpreise/${beilagenPreis.id}`, beilagenPreis);
    Notify.create({
      message: "Daten erfolgreich gespeichert...",
      position: "top",
      color: "positive",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Kontakt-Daten", error);
    Notify.create({
      message: "Fehler beim Speichern der Daten!",
      position: "top",
      color: "negative",
      icon: "clear",
    });
  }
};

const deleteBeilage = async (id: number) => {
  try {
    await api.delete(`/api/beilagen/beilagenname/${id}`);
    await loadBeilagen();
    Notify.create({
      message: "Beilage erfolgreich gelöscht",
      position: "top",
      color: "positive",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim löschen der Beilage", error);
  }
};

const deleteSauce = async (id: number) => {
  try {
    await api.delete(`/api/saucen/${id}`);
    await loadSaucen();
    Notify.create({
      message: "Sauce erfolgreich gelöscht",
      position: "top",
      color: "positive",
      icon: "check",
    });
  } catch (error) {
    console.error("Fehler beim löschen der Sauce", error);
    Notify.create({
      message: "Fehler beim löschen der Sauce",
      position: "top",
      color: "negative",
      icon: "clear",
    });
  }
};

onMounted(async () => {
  await loadBeilagen();
  await loadSaucen();
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

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.premium-expansion {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.premium-chip {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.534);
  color: white !important;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>