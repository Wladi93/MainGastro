<template>
  <q-list>
    <q-item-label class="q-mb-sm" caption>Beilagen hinzufügen:</q-item-label>
    <q-input
      label="bitte Name eingeben"
      filled
      v-model="beilage"
      @keyup.enter="postBeilage()"
    />
    <q-btn
      :disable="beilage.length == 0"
      label="speichern"
      icon="save"
      color="secondary"
      class="full-width q-mt-sm"
      @click="postBeilage()"
    />

    <q-expansion-item
      class="q-mt-sm text-grey"
      icon="list"
      label="angelegte Beilagen"
      header-class="bg-grey-3"
    >
      <div class="q-mt-md">
        <q-list v-for="beilageName in beilageName" :key="beilageName.id">
          <q-chip class="q-ml-md" dense color="info">
            {{ beilageName.beilageName }}
            <q-btn
              dense
              round
              flat
              size="xs"
              icon="close"
              color="grey"
              @click.stop="deleteBeilage(beilageName.id)"
            />
          </q-chip>
        </q-list>
      </div>
    </q-expansion-item>

    <q-separator class="q-my-md" />

    <q-item-label class="q-mb-sm" caption>Preise Beilagen:</q-item-label>

    <q-input prefix="€" filled label="Preis für Klein:" v-model="preisKlein" />

    <q-input
      class="q-mt-sm"
      filled
      label="Preis für Mittel:"
      v-model="preisMittel"
      prefix="€"
    />

    <q-input
      prefix="€"
      class="q-mt-sm"
      filled
      label="Preis für Groß:"
      v-model="preisGross"
    />

    <q-input
      prefix="€"
      class="q-mt-sm"
      filled
      label="Preis für Familie:"
      v-model="preisFamilie"
    />

    <q-separator inset class="q-my-md" />

    <q-item-label class="q-mb-sm" caption>Saucen hinzufügen:</q-item-label>

    <q-input
      label="bitte Name eingeben"
      filled
      v-model="sauce"
      @keyup.enter="postSauce()"
    />
    <q-btn
      :disable="sauce.length == 0"
      label="speichern"
      icon="save"
      color="secondary"
      class="full-width q-mt-sm"
      @click="postSauce()"
    />

    <q-expansion-item
      class="q-mt-sm text-grey"
      icon="list"
      label="angelegte Saucen"
      header-class="bg-grey-3"
    >
      <div class="q-mt-md">
        <q-list v-for="sauce in saucenName" :key="sauce.id">
          <q-chip class="q-ml-md" dense color="info">
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

    <q-btn
      @click="updateBeilagenPreise()"
      color="secondary"
      label="speichern"
      icon="save"
      class="full-width q-mt-sm"
    />
  </q-list>
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

    if (beilage.value.length == 0) {
      return;
    }
    await api.post(`/api/beilagen/beilagenname`, newBeilage);
    beilage.value = "";
    await loadBeilagen();

    Notify.create({
      message: "Daten erfolgreich gespeichert...",
      position: "top",
      color: "positive",
      icon: "check",
    });

    beilage.value = "";
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

    if (sauce.value.length == 0) {
      return;
    }
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
    await api.put(
      `/api/beilagen/beilagenpreise/${beilagenPreis.id}`,
      beilagenPreis
    );

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
