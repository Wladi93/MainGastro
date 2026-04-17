<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">KONTAKT</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold">IHR ANLIEGEN</div>
            <div class="text-h4 text-white text-weight-bolder">Schreiben Sie uns</div>
          </div>

          <div class="q-gutter-y-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="vorname"
                  dark
                  filled
                  label="Vorname *"
                  color="secondary"
                  class="premium-input"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                >
                  <template v-slot:prepend><q-icon name="badge" /></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="nachname"
                  dark
                  filled
                  label="Nachname *"
                  color="secondary"
                  class="premium-input"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                >
                  <template v-slot:prepend><q-icon name="badge" /></template>
                </q-input>
              </div>
            </div>

            <q-input
              v-model="email"
              dark
              filled
              label="E-Mail-Adresse *"
              color="secondary"
              class="premium-input"
              :rules="[(val) => (val && val.includes('@')) || 'Gültige E-Mail erforderlich']"
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              v-model="telefon"
              dark
              filled
              label="Telefonnummer"
              color="secondary"
              class="premium-input"
              :rules="[(val) => !val || /^(\+?\d+)*$/.test(val) || 'Ungültiges Format']"
            >
              <template v-slot:prepend><q-icon name="phone" /></template>
            </q-input>

            <q-input
              v-model="anliegen"
              dark
              filled
              type="textarea"
              label="Ihre Nachricht *"
              color="secondary"
              class="premium-input"
              :rules="[(val) => !!val || 'Bitte formulieren Sie Ihr Anliegen']"
            >
              <template v-slot:prepend><q-icon name="description" /></template>
            </q-input>

            <q-btn
              class="full-width q-mt-md send-button"
              color="secondary"
              label="Nachricht Absenden"
              no-caps
              size="lg"
              @click="sendKontaktToApi"
              :text-color="schriftFarbe ? 'white' : 'black'"
            >
              <q-icon name="send" class="q-ml-sm" size="xs" />
            </q-btn>
          </div>

          <q-separator dark class="q-mt-xl q-mb-sm full-width opacity-2" />
          
          <div class="text-overline text-grey-5 text-center">
            Wir antworten Ihnen in der Regel innerhalb von 24h.
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-5">
        Unsere Auswahl entdecken? Zur 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/speisekarte">
          Speisekarte
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import api from "src/boot/axios";

const router = useRouter();
const $q = useQuasar();

const vorname = ref("");
const nachname = ref("");
const email = ref("");
const telefon = ref("");
const anliegen = ref("");

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

const sendKontaktToApi = async () => {
  $q.loading.show();
  try {
    const kontaktData = {
      vorname: vorname.value,
      nachname: nachname.value,
      email: email.value,
      telefon: telefon.value,
      anliegen: anliegen.value,
    };

    await api.post("/api/kontaktmail", kontaktData);

    $q.notify({
      message: "Nachricht erfolgreich gesendet!",
      icon: "check",
      color: "green",
      position: "top",
      timeout: 2000,
    });
    
    await router.push("/");
  } catch (error) {
    console.error("Fehler:", error);
    $q.notify({
      message: "Fehler beim Senden.",
      icon: "cancel",
      color: "red",
      position: "top",
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await loadSchriftFarbe();
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
}

.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  top: 53px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
  padding-top: 80px;
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

.send-button {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.no-decoration {
  text-decoration: none;
}

.opacity-2 {
  opacity: 0.1;
}

.uppercase {
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .card-inner {
    padding: 30px 20px;
  }
  .text-h4 {
    font-size: 1.8rem;
  }
}
</style>