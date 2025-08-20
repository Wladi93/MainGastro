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
          @update:model-value="(val) => $emit('mwStChanged', val)"
        />
        <q-input
          type="number"
          v-model="bestellMail.mwSt"
          filled
          label="MwSt in %"
        />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-btn
        @click="updateBestellMail(bestellMail)"
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
import { onMounted, ref } from "vue";
import type {
  BestellMail,
  BestellMailResponse,
} from "src/pages/types/BestellMailType";

const bestellMail = ref<BestellMail[]>([]);

const isPwd = ref(true);
const isLoading = ref(false);

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

const updateBestellMail = async (bestellMail: BestellMail) => {
  isLoading.value = true;
  try {
    await api.put(`/api/bestellmail/${bestellMail.id}`, bestellMail);
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

onMounted(async () => {
  await loadBestellMail();
});
</script>
