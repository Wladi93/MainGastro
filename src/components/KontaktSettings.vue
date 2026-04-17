<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">SYSTEM</div>
            <div class="text-h5 text-white text-weight-light uppercase">E-Mail Konfiguration</div>
          </div>

          <div v-for="kontakt in kontaktMail" :key="kontakt.id" class="q-gutter-y-lg">
            
            <div>
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Absender & Authentifizierung</div>
              
              <q-input 
                dark filled 
                v-model="kontakt.email" 
                label="Kontakt E-Mail" 
                class="premium-input q-mb-md"
                clearable
              >
                <template v-slot:prepend><q-icon name="mail" /></template>
              </q-input>

              <q-input
                dark filled
                v-model="kontakt.password"
                label="Passwort Email-Adresse"
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
            </div>

            <q-separator dark class="q-my-lg opacity-10" />

            <div>
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Server-Einstellungen</div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-8">
                  <q-input 
                    dark filled 
                    v-model="kontakt.smtp" 
                    label="SMTP-Server" 
                    class="premium-input"
                    clearable
                  >
                    <template v-slot:prepend><q-icon name="dns" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-4">
                  <q-input 
                    dark filled 
                    v-model="kontakt.port" 
                    label="Port" 
                    class="premium-input"
                    clearable
                  >
                    <template v-slot:prepend><q-icon name="settings_input_component" /></template>
                  </q-input>
                </div>
              </div>
            </div>

            <q-btn
              @click="updateKontaktMail(kontakt)"
              label="Konfiguration speichern"
              icon="save"
              color="secondary"
              class="luxury-btn full-width q-mt-xl"
              :loading="isLoading"
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
import type {
  KontaktMail,
  KontaktMailResponse,
} from "src/pages/types/KontaktType";
import { onMounted, ref } from "vue";

// --- LOGIK: EXAKT WIE IN CODE 1 ---
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
  await loadKontaktMail();
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

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.tracking-widest { letter-spacing: 3px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>