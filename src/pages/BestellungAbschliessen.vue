<template>
  <q-layout view="lHh Lpr lFf" class="glass-layout">
    <q-page-container>
      <!-- class="header-glass q-pa-md flex flex-center">
        <h1 class="text-h5 text-weight-bolder text-secondary flex items-center q-ma-none tracking-widest">
          <q-icon name="checklist" class="q-mr-sm" size="md" />
          BESTELLUNG
        </h1>
      </div> -->

      <div class="row justify-center q-pa-md">
        <q-card class="order-glass-card q-mt-md shadow-24 overflow-hidden">
          <q-card-section class="text-center q-pb-none">
            <div class="text-overline text-white opacity-7">
              Bitte vervollständigen Sie Ihre Angaben
            </div>
            <q-separator dark class="q-mt-sm opacity-2" />
          </q-card-section>

          <q-card-section class="q-gutter-y-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="vorname"
                  label="Vorname"
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="Ihr Vorname"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                >
                  <template v-slot:prepend><q-icon name="badge" /></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="nachname"
                  label="Nachname"
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="Ihr Nachname"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                >
                  <template v-slot:prepend><q-icon name="badge" /></template>
                </q-input>
              </div>
            </div>

            <q-input
              v-model="email"
              label="E-Mail"
              filled
              dark
              color="secondary"
              class="premium-input"
              placeholder="beispiel@mail.de"
              :rules="[(val) => (val && val.includes('@')) || 'Gültige E-Mail erforderlich']"
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              v-model="telefon"
              label="Telefon / Mobil"
              filled
              dark
              color="secondary"
              class="premium-input"
              placeholder="Ihre Telefonnummer"
              :rules="[(val) => !!val || 'Pflichtfeld']"
            >
              <template v-slot:prepend><q-icon name="phone" /></template>
            </q-input>

            <div class="row q-col-gutter-sm">
              <div class="col-9">
                <q-input
                  v-model="strasse"
                  label="Straße"
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="Straße"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="hausnr"
                  label="Nr."
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="Nr."
                  :rules="[(val) => !!val || 'Nö']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-8">
                <q-input
                  v-model="stadt"
                  label="Stadt"
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="Ort"
                  :rules="[(val) => !!val || 'Pflichtfeld']"
                />
              </div>
              <div class="col-4">
                <q-input
                  v-model="plz"
                  label="PLZ"
                  filled
                  dark
                  color="secondary"
                  class="premium-input"
                  placeholder="12345"
                  :rules="[(val) => /^\d{5}$/.test(val) || 'Falsche PLZ']"
                />
              </div>
            </div>

            <div class="delivery-status-box q-pa-md flex items-center justify-between">
              <span class="text-caption text-grey-5 uppercase tracking-widest">Modus:</span>
              <q-chip v-if="cartStore.liefernAbholen.liefern" color="secondary" text-color="dark" icon="moped" class="text-weight-bold">
                Liefern
              </q-chip>
              <q-chip v-else color="secondary" text-color="dark" icon="storefront" class="text-weight-bold">
                Abholen
              </q-chip>
            </div>

            <q-input
              v-model="anliegen"
              label="Nachricht an uns"
              filled
              dark
              type="textarea"
              color="secondary"
              class="premium-input"
              placeholder="Besonderheiten zur Lieferung/Bestellung..."
              rows="2"
            >
              <template v-slot:prepend><q-icon name="description" /></template>
            </q-input>

            <div class="checkbox-container q-pa-sm">
              <q-checkbox v-model="val" dark color="secondary" size="md">
                <span class="text-caption text-grey-5">
                  Ich akzeptiere die 
                  <RouterLink class="text-secondary underline" to="/agbs">AGB's</RouterLink> und die 
                  <RouterLink class="text-secondary underline" to="/wiederrufsrechtsbelehrung">Widerrufsbelehrung</RouterLink>.
                </span>
              </q-checkbox>
            </div>

            <q-btn
              class="full-width premium-order-btn q-mt-md"
              color="secondary"
              text-color="dark"
              @click="sendOrderToAPI"
              :disable="!isFormValid"
            >
              <div class="row items-center">
                <span>BESTELLUNG ABSENDEN</span>
                <q-icon name="send" class="q-ml-md" size="xs" />
              </div>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <div class="text-center q-mt-lg">
        <RouterLink class="text-secondary text-overline tracking-widest" to="/speisekarte" style="text-decoration: none">
          <q-icon name="arrow_back" /> Zurück zur Speisekarte
        </RouterLink>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useCartStore } from "src/store/cardStore";
import api from "src/boot/axios";
import type { BestellMail, BestellMailResponse } from "./types/BestellMailType";
import type { SaucenType } from "./types/SaucenType";

const val = ref(false);
const router = useRouter();
const cartStore = useCartStore();
const $q = useQuasar();
const vorname = ref("");
const nachname = ref("");
const hausnr = ref("");
const stadt = ref("");
const plz = ref("");
const strasse = ref("");
const email = ref("");
const telefon = ref("");
const anliegen = ref("");
const sauce = ref<SaucenType[]>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSauceNameForItem = (item: any) => {
  if (!item.saucenIds || item.saucenIds.length === 0) return "";
  const sauceId = item.saucenIds[0];
  const foundSauce = sauce.value.find((s) => s.id === sauceId);
  return foundSauce?.name || "";
};

const isFormValid = computed(() => {
  return (
    val.value &&
    vorname.value.trim() !== "" &&
    nachname.value.trim() !== "" &&
    email.value.trim() !== "" &&
    telefon.value.trim() !== "" &&
    strasse.value.trim() !== "" &&
    hausnr.value.trim() !== "" &&
    stadt.value.trim() !== "" &&
    plz.value.trim() !== ""
  );
});

const auswahl = computed(() => {
  if (cartStore.liefernAbholen.liefern) {
    return "Liefern";
  } else if (cartStore.liefernAbholen.abholen) {
    return "Abholen";
  }
  return "";
});
const anmerkung = ref("");
const bestellMail = ref<BestellMail[]>([]);

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

const validateForm = () => {
  if (!val.value) {
    $q.notify({
      message: "Bitte akzeptieren Sie die AGB's und Widerrufsbelehrung.",
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  const requiredFields = [
    { value: vorname.value, name: "Vorname" },
    { value: nachname.value, name: "Nachname" },
    { value: email.value, name: "E-Mail" },
    { value: telefon.value, name: "Telefon" },
    { value: strasse.value, name: "Straße" },
    { value: hausnr.value, name: "Hausnummer" },
    { value: stadt.value, name: "Stadt" },
    { value: plz.value, name: "PLZ" },
  ];

  const emptyFields = requiredFields.filter(
    (field) => !field.value || field.value.trim() === ""
  );

  if (emptyFields.length > 0) {
    $q.notify({
      message: `Bitte füllen Sie folgende Felder aus: ${emptyFields.map((f) => f.name).join(", ")}`,
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  // E-Mail Validierung
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    $q.notify({
      message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  // Telefon Validierung
  if (!/^(\+?\d+)*$/.test(telefon.value)) {
    $q.notify({
      message: "Bitte geben Sie eine gültige Telefonnummer ein.",
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  // Hausnummer Validierung
  if (!/^\d+[a-zA-Z]*$/.test(hausnr.value)) {
    $q.notify({
      message: "Bitte geben Sie eine gültige Hausnummer ein.",
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  // PLZ Validierung
  if (!/^\d{5}$/.test(plz.value)) {
    $q.notify({
      message: "Bitte geben Sie eine gültige 5-stellige PLZ ein.",
      icon: "warning",
      color: "orange",
      position: "top",
      timeout: 3000,
    });
    return false;
  }

  return true;
};

const sendOrderToAPI = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    const orderData = {
      vorname: vorname.value,
      nachname: nachname.value,
      email: email.value,
      telefon: telefon.value,
      strasse: strasse.value,
      hausnr: hausnr.value,
      stadt: stadt.value,
      plz: plz.value,
      auswahl: auswahl.value,
      anmerkung: anmerkung.value,
      anliegen: anliegen.value,
      cartItems: cartStore.genericCartItems.map((item) => {
        const basePrice = item.price || 0;
        const beilagenPrice =
          item.hasBeilagen && item.beilagen!.length > 0
            ? item.beilagen!.length * (item.beilagenPreis || 0)
            : 0;
        const totalPrice = basePrice + beilagenPrice;

        return {
          id: item.id,
          name: item.name,
          saucenIds: getSauceNameForItem(item),
          size: item.selectedSize,
          quantity: item.quantity,
          price: totalPrice,
          anmerkung: item.anmerkung,
          beilagen: Array.isArray(item.beilagen)
            ? item.beilagen.join(", ")
            : item.beilagen,
        };
      }),
    };

    const response = await api.post(`/api/bestellung`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data;

    $q.notify({
      message: "Bestellung erfolgreich gesendet!",
      icon: "check",
      color: "green",
      position: "top",
      timeout: 400,
    });

    console.log(result);
  } catch (error) {
    console.error("Fehler:", error);
    $q.notify({
      message: "Fehler beim Senden der Bestellung.",
      icon: "cancel",
      color: "red",
      position: "top",
      timeout: 400,
    });
  } finally {
    await router.push("/abgeschlossen");
    cartStore.clearCart();
    $q.loading.hide();
  }
};

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    sauce.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Saucen", error);
  }
}

onMounted(async () => {
  await loadBestellMail();
  await loadSaucen();
});
</script>

<style scoped>
.glass-layout {
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
  min-height: 100vh;
  padding-top: 40px;
}

/* Glass Effekt für Karten */
.order-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
}

.header-glass {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Input Styling */
.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
}

.premium-input :deep(.q-field__control):hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

.delivery-status-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.premium-order-btn {
  border-radius: 16px;
  height: 56px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.checkbox-container {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.01);
}

.underline { text-decoration: underline; }
.tracking-widest { letter-spacing: 0.2em; }
.opacity-2 { opacity: 0.1; }
.opacity-7 { opacity: 0.7; }

/* Desktop Optimierung */
@media (min-width: 600px) {
  .order-glass-card {
    margin-top: 40px;
  }
}
</style>