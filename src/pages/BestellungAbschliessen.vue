<template>
  <q-layout>
    <q-page-container>
      <q-banner class="banner full-width text-accent">
        <h6 class="bannerText">
          <q-icon name="checklist" class="bannerIcon" />
          Bestellung
        </h6>
      </q-banner>

      <div class="oben bg-white">
        <q-separator color="accent" />
        <h2 class="textOben text-h5 text-weight-thin text-center">
          deine Bestellung abschließen...
        </h2>
        <q-separator class="separatorOben" size="15px" color="grey-6" />
      </div>
      <q-img class="background-img" />
      <div class="row items-start">
        <q-card bordered aquare class="my-card align-center q-mt-md">
          <div class="q-gutter-y-md">
            <q-card-section>
              <h2 class="text-overline">
                zum Abschließen der Bestellung bitte ausfüllen
              </h2>
              <q-separator class="q-mb-md" />
              <q-input
                class="q-mb-sm"
                filled
                v-model="vorname"
                label="Vorname"
                stack-label
                label-color="secondary"
                placeholder="bitte den Vornamen eingeben..."
                :dense="dense"
                :rules="[(val) => !!val || 'Bitte Ausfüllen']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                class="q-mb-sm"
                filled
                v-model="nachname"
                label="Nachname"
                stack-label
                label-color="secondary"
                placeholder="bitte den Nachnamen eingeben..."
                :dense="dense"
                :rules="[(val) => !!val || 'Bitte Ausfüllen']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                label-slot
                class="q-mb-sm"
                filled
                v-model="email"
                label="E-Mail"
                stack-label
                label-color="secondary"
                placeholder="bitte die E-Mail-Adresse eingeben..."
                :dense="dense"
                :rules="[
                  (val) =>
                    (val && val.includes('@')) ||
                    'bitte eine gültige E-Mail-Adresse angeben.',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                class="q-mb-sm"
                filled
                v-model="telefon"
                label="Telefon/Handynr."
                label-color="secondary"
                stack-label
                placeholder="bitte die Nummer eingeben..."
                :dense="dense"
                :rules="[
                  (val) => !!val || 'Bitte Ausfüllen',
                  (val) =>
                    /^(\+?\d+)*$/.test(val) ||
                    'Bitte eine gültige Nummer angeben',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
              <div class="straßeNr">
                <q-input
                  class="inputStraße q-mb-sm"
                  filled
                  v-model="strasse"
                  label="Straße"
                  stack-label
                  label-color="secondary"
                  placeholder="bitte die Straße eingeben..."
                  :dense="dense"
                  :rules="[(val) => !!val || 'Bitte Ausfüllen']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
                <q-input
                  class="inputNr q-mb-sm"
                  filled
                  v-model="hausnr"
                  label="Nr."
                  stack-label
                  label-color="secondary"
                  placeholder="Hausnr."
                  :dense="dense"
                  :rules="[
                    (val) => !!val || 'Bitte Ausfüllen',
                    (val) =>
                      /^\d+$/.test(val) || 'Bitte eine gültige Nummer angeben',
                  ]"
                >
                </q-input>
              </div>
              <div class="straßeNr">
                <q-input
                  class="inputStraße q-mb-sm"
                  filled
                  v-model="stadt"
                  label="Stadt"
                  stack-label
                  label-color="secondary"
                  placeholder="bitte Stadt eingeben"
                  :dense="dense"
                  :rules="[(val) => !!val || 'Bitte Ausfüllen']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
                <q-input
                  class="inputNr q-mb-sm"
                  filled
                  v-model="plz"
                  label="PLZ"
                  stack-label
                  label-color="secondary"
                  placeholder="Postleitzahl"
                  :dense="dense"
                  :rules="[
                    (val) => !!val || 'Bitte Ausfüllen',
                    (val) =>
                      /^\d{5}$/.test(val) || 'Bitte gültige PLZ eintragen',
                  ]"
                >
                </q-input>
              </div>

              <q-list
                v-if="bestellMail[0]?.liefernOn || bestellMail[0]?.abholenOn"
                class="flex column q-mb-md"
              >
                <q-separator class="q-mb-sm" />
                <div class="flex row" style="align-items: center; gap: 15px">
                  <q-item-label class="float-left flex" caption
                    >Liefern/Abholen:</q-item-label
                  >

                  <q-chip
                    color="grey-3"
                    v-if="cartStore.liefernAbholen.liefern"
                    class="text-subtitle1 text-accent"
                  >
                    <q-icon
                      name="moped"
                      color="accent"
                      size="sm"
                      class="q-mr-xs"
                    />
                    Liefern</q-chip
                  >

                  <q-chip
                    color="grey-3"
                    v-if="cartStore.liefernAbholen.abholen"
                    class="text-subtitle1 text-accent"
                  >
                    <q-icon
                      name="storefront"
                      color="accent"
                      size="sm"
                      class="q-mr-xs"
                    />
                    Abholen</q-chip
                  >
                </div>

                <q-separator class="q-mt-sm" />
              </q-list>

              <q-input
                class="q-mb-sm"
                filled
                v-model="anliegen"
                label="Nachricht"
                label-color="secondary"
                stack-label
                placeholder="hier kann eine Nachricht bzgl. der Bestellung hinterlassen werden..."
                :dense="dense"
                type="textarea"
                :rules="[() => true]"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
              <div class="checkbox">
                <p>
                  <q-checkbox v-model="val" size="lg"></q-checkbox>mit dem
                  Absenden der Bestellung akzeptiere ich die
                  <RouterLink class="text-secondary" to="/agbs"
                    >AGB's</RouterLink
                  >
                  und die
                  <RouterLink
                    class="text-secondary"
                    to="/wiederrufsrechtsbelehrung"
                    >Widerrufsbelehrung</RouterLink
                  >.
                </p>
              </div>
              <q-btn
                class="full-width"
                :size="$q.screen.lt.sm ? 'sm' : 'md'"
                ripple
                square
                color="secondary"
                push
                label="Bestellung absenden"
                @click="sendOrderToAPI"
                :disable="!val"
              >
                <q-icon name="send" class="icn" />
              </q-btn>
            </q-card-section>
          </div>
        </q-card>
      </div>
      <h5 class="text-caption text-center color-secondary">
        Bestellen? zur
        <RouterLink class="text-secondary" to="/speisekarte"
          >Speisekarte</RouterLink
        >
      </h5>
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
const dense = ref(false);

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

const sendOrderToAPI = async () => {
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
      cartItems: cartStore.genericCartItems.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.sizes,
        quantity: item.quantity,
        price: item.price,
        anmerkung: item.anmerkung,
      })),
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

onMounted(async () => {
  await loadBestellMail();
});
</script>

<style scoped>
.checkbox {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.inputStraße {
  width: 100%;
}
.inputNr {
  width: 30%;
}
.straßeNr {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
.my-card {
  min-width: 60vw;
  max-width: 900px;
  margin-top: 2%;
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  padding: 0.5%;
  text-align: center;
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/bestellungAbsenden.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.icn {
  font-size: 28px;
  margin-left: 1%;
}
.bannerIcon {
  size: 30px;
}
@media (max-width: 600px) {
  .my-card {
    width: 100%;
  }
  .oben {
    display: flex;
    justify-content: center;
    flex-direction: row;
    height: 45px;
  }
  .textOben {
    font-size: 12px;
  }
  .separatorOben {
    display: flex;
    flex-direction: row;
    top: 0;
    max-height: 8px;
  }
  .banner {
    max-height: 10px;
  }
  .bannerText {
    font-size: 12px;
  }
  .bannerIcon {
    font-size: 20px;
  }
}
</style>
