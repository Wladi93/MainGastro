<template>
  <q-list
    class="full-width"
    v-for="bestellMail in bestellMail"
    :key="bestellMail.id"
  >
    <div class="full-width">
      <q-item-section>
        <q-item-label class="q-mb-sm" caption>Bestell E-Mail:</q-item-label>
        <q-input clearable label="E-Mail:" filled v-model="bestellMail.email" />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-md" />

      <q-item-section>
        <q-item-label class="q-mb-sm" caption>
          Passwort Email-Adresse:
        </q-item-label>
        <q-form>
          <q-input
            label="Passwort"
            filled
            v-model="bestellMail.password"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template> </q-input
        ></q-form>
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label class="q-mb-sm" caption>SMTP-Server:</q-item-label>
        <q-input clearable label="Smtp:" filled v-model="bestellMail.smtp" />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-md" />

      <q-item-section>
        <q-item-label class="q-mb-sm" caption>SMTP-Port:</q-item-label>
        <q-input clearable label="Port:" filled v-model="bestellMail.port" />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label caption>Rechnung:</q-item-label>
        <q-toggle
          class="text-caption"
          v-model="bestellMail.rechnungOn"
          label="Rechnung erstellen"
          color="positive"
          @update:model-value="
            (val) => {
              if (!val) bestellMail.rechnungSendenOn = false;
            }
          "
        />
        <q-toggle
          :disable="!bestellMail.rechnungOn"
          class="text-caption"
          v-model="bestellMail.rechnungSendenOn"
          label="Rechnung per Mail mit senden"
          color="positive"
        />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label caption>Bestellung liefern:</q-item-label>
        <q-toggle
          class="text-caption"
          v-model="bestellMail.liefernOn"
          label="Liefern anbieten"
          color="positive"
        />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label caption>Bestellung abholen:</q-item-label>
        <q-toggle
          class="text-caption"
          v-model="bestellMail.abholenOn"
          label="Abholen anbieten"
          color="positive"
        />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label caption>Mwst:</q-item-label>
        <q-toggle
          class="text-caption"
          v-model="bestellMail.mwStOn"
          label="MwSt aktivieren"
          color="positive"
        />
        <div style="position: relative">
          <q-input
            :disable="!bestellMail.mwStOn"
            type="number"
            v-model="bestellMail.mwSt"
            filled
            label="MwSt eingeben:"
            ref="inputRef"
            maxlength="2"
            prefix="%"
          />
        </div>
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-item-section>
        <q-item-label caption>Fahrkosten:</q-item-label>
        <q-toggle
          class="text-caption"
          v-model="fahrkosten[0]!.fahrkostenOn"
          label="Fahrkosten aktivieren"
          color="positive"
        />
        <q-input
          :disable="!fahrkosten[0]!.fahrkostenOn"
          type="number"
          v-model="vModelFahrkosten"
          filled
          label="Fahrkosten eingeben:"
          ref="inputRef"
          maxlength="2"
          prefix="€"
        />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-btn
        @click="updateBestellMail(bestellMail, fahrkosten[0]!)"
        label="Speichern"
        icon="save"
        color="secondary"
        class="full-width q-mt-sm"
        :loading="isLoading"
      />
    </div>
  </q-list>
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
    console.error(`Error fetching opening hours`, error);
  }
};

const updateBestellMail = async (
  bestellMail: BestellMail,
  fahrkosten: Fahrkosten
) => {
  isLoading.value = true;
  try {
    await api.put(`/api/bestellmail/${bestellMail.id}`, bestellMail);
    await api.put(`/api/fahrkosten/${fahrkosten.id}`, fahrkosten);

    EventBus.emit("bestellmail-updated", bestellMail);

    EventBus.emit("fahrkosten-updated", fahrkosten);

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
  } finally {
    isLoading.value = false;
  }
};

async function loadFahrkosten() {
  try {
    const response = await api.get("/api/fahrkosten");

    fahrkosten.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Fahrkosten:", error, fahrkosten);
    Notify.create({
      type: "negative",
      position: "top",
      icon: "clear",
      message: "Fehler beim Laden der Fahrkosten",
    });
  }
}

onMounted(async () => {
  await loadFahrkosten();
  await loadBestellMail();
});
</script>
<style scoped></style>
