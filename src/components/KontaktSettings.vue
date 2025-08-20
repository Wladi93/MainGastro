<template>
  <q-list class="full-width" v-for="kontakt in kontaktMail" :key="kontakt.id">
    <div class="full-width">
      <q-item-section>
        <q-item-label class="q-mb-sm" caption>Kontakt E-Mail:</q-item-label>
        <q-input clearable label="E-Mail:" filled v-model="kontakt.email" />
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
            v-model="kontakt.password"
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
        <q-input clearable label="Smtp:" filled v-model="kontakt.smtp" />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-md" />

      <q-item-section>
        <q-item-label class="q-mb-sm" caption>SMTP-Port:</q-item-label>
        <q-input clearable label="Port:" filled v-model="kontakt.port" />
      </q-item-section>

      <q-separator class="q-mt-md q-mb-sm" />

      <q-btn
        @click="updateKontaktMail(kontakt)"
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
import type {
  KontaktMail,
  KontaktMailResponse,
} from "src/pages/types/KontaktType";
import { onMounted, ref } from "vue";

const kontaktMail = ref<KontaktMail[]>([]);
const isPwd = ref(true);
const isLoading = ref(false);

const loadKontaktMail = async () => {
  try {
    const response = await api.get(`/api/kontaktmail`);
    kontaktMail.value = response.data.map((item: KontaktMailResponse) => ({
      ...item,
      password: "",
    }));
  } catch (error) {
    console.error(`Error fetching opening hours`, error);
  }
};

const updateKontaktMail = async (kontakt: KontaktMail) => {
  isLoading.value = true;
  try {
    await api.put(`/api/kontaktmail/${kontakt.id}`, kontakt);

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
  await loadKontaktMail();
});
</script>
