<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">WARENKORB</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card q-mb-xl shadow-24">
        <div class="card-inner">
          
          <div class="text-center q-mb-lg">
            <div class="text-overline text-secondary text-weight-bold">DEINE BESTELLUNG</div>
            <div class="text-h4 text-white text-weight-bolder">Warenkorb</div>
          </div>

          <div class="row justify-center q-mb-lg">
            <div class="toggle-container flex items-center q-pa-xs">
              <q-btn
                v-if="bestellMail[0]?.liefernOn"
                flat
                no-caps
                :class="liefern ? 'toggle-active' : 'toggle-inactive'"
                icon="moped"
                label="Liefern"
                @click="onLiefern"
              />
              <q-btn
                v-if="bestellMail[0]?.abholenOn"
                flat
                no-caps
                :class="abholen ? 'toggle-active' : 'toggle-inactive'"
                icon="storefront"
                label="Abholen"
                @click="onAbholen"
              />
            </div>
          </div>

          <q-separator dark class="q-mb-lg opacity-2" />

          <div v-if="genericCartItems.length === 0" class="text-center q-pa-xl text-grey-5">
            <q-icon name="shopping_cart" size="xl" class="q-mb-sm opacity-2" /><br>
            Es befinden sich keine Artikel in Ihrem Warenkorb...
          </div>

          <div v-else class="q-gutter-y-md">
            <div 
              v-for="item in genericCartItems" 
              :key="item.id + '_' + item.sizes"
              class="cart-item-row row items-center q-pa-sm"
            >
              <q-img
                :src="getFullImageUrl(item.img)"
                class="item-image q-mr-md"
              />

              <div class="col column">
                <div class="text-weight-bold text-white text-body1">{{ item.name }}</div>
                
                <div class="row q-gutter-xs q-mt-xs">
                  <q-chip v-if="item.saucenIds!.length > 0" dense size="12px" color="secondary" text-color="dark" outline>
                    Sauce: {{ getSauceNameForItem(item) }}
                  </q-chip>
                  
                  <q-chip v-for="(beilage, idx) in item.beilagen" :key="idx" dense size="12px" color="secondary" text-color="dark" outline>
                    {{ beilage }}
                  </q-chip>

                  <q-chip v-if="item.hasSizes" dense size="12px" color="secondary" text-color="dark" outline>
                    Größe: {{ item.selectedSize }}
                  </q-chip>
                </div>

                <div class="text-caption text-grey-5 q-mt-xs" v-if="item.anmerkung">
                  "{{ item.anmerkung }}"
                </div>
              </div>

              <div class="text-right q-mx-md">
                <div class="text-weight-bold text-white">{{ (itemPreis(item) * item.quantity).toFixed(2) }}€</div>
                <div class="text-caption text-secondary">{{ item.quantity }}x</div>
              </div>

              <div class="column q-gutter-y-xs">
                <q-btn flat round dense icon="edit" color="grey-5" size="sm" @click="editItem(item)" />
                <q-btn flat round dense icon="delete" color="negative" size="sm" @click="removeItem(item)" />
              </div>
            </div>
          </div>

          <div v-if="genericCartItems.length > 0" class="summary-box q-mt-xl q-pa-lg">
            <div v-if="showMwSt">
              <div class="row justify-between text-body1 text-white">
                <span>{{ liefern && fahrkosten[0]?.fahrkostenOn ? 'Gesamtsumme inkl. MwSt:' : 'Summe:' }}</span>
                <span class="text-weight-bolder text-secondary">
                  {{ liefern && fahrkosten[0]?.fahrkostenOn ? totalFahrkosten.toFixed(2) : totalAmount.toFixed(2) }}€
                </span>
              </div>
              
              <div class="row justify-between text-caption text-grey-5 q-mt-sm" v-if="liefern && fahrkosten[0]?.fahrkostenOn">
                <span>Lieferkosten:</span>
                <span>{{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€</span>
              </div>

              <q-separator dark class="q-my-sm opacity-2" />

              <div class="row justify-between text-caption text-grey-6">
                <span>MwSt. ({{ bestellMail[0]?.mwSt }}%):</span>
                <span>{{ MwSt.toFixed(2) }}€</span>
              </div>
              <div class="row justify-between text-caption text-grey-6">
                <span>Netto:</span>
                <span>{{ bruttoPreis.toFixed(2) }}€</span>
              </div>
            </div>

            <div v-else>
               <div class="row justify-between text-h6 text-white">
                <span>Gesamtsumme:</span>
                <span class="text-secondary text-weight-bolder">
                   {{ liefern && fahrkosten[0]?.fahrkostenOn ? totalFahrkosten.toFixed(2) : totalAmount.toFixed(2) }}€
                </span>
              </div>
              <div class="text-caption text-grey-5 text-right" v-if="liefern && fahrkosten[0]?.fahrkostenOn">
                inkl. {{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€ Lieferkosten
              </div>
            </div>
          </div>

          <q-btn
            class="full-width q-mt-xl checkout-button"
            color="secondary"
            label="Bestellung abschließen"
            size="lg"
            no-caps
            icon-right="chevron_right"
            @click="bestellen"
          />

        </div>
      </div>
    </div>

    <WarenkorbItemBearbeiten
      v-model:selectedItem="selectedItem"
      v-model:isOpen="isOpen"
    />
  </div>
</template>

<script setup lang="ts">
// ... (Die gesamte Script-Logik bleibt absolut identisch) ...
import { useCartStore } from "src/store/cardStore";
import type { GenericCartItem } from "src/store/cardStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import WarenkorbItemBearbeiten from "./Dialog/WarenkorbItemBearbeiten.vue";
import type { BestellMail, BestellMailResponse } from "./types/BestellMailType";
import type { Fahrkosten } from "./types/FahrkostenType";
import api, { getBaseURL } from "src/boot/axios";
import type { SaucenType } from "./types/SaucenType";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const cartStore = useCartStore();
const bestellMail = ref<BestellMail[]>([]);
const genericCartItems = computed(() => cartStore.genericCartItems);
const fahrkosten = ref<Fahrkosten[]>([]);
const sauce = ref<SaucenType[]>([]);

const getSauceNameForItem = (item: GenericCartItem) => {
  if (!item.saucenIds || item.saucenIds.length === 0) return "";
  const sauceId = item.saucenIds[0];
  const foundSauce = sauce.value.find((s) => s.id === sauceId);
  return foundSauce?.name || "";
};

const liefern = computed(() => cartStore.liefernAbholen.liefern);
const abholen = computed(() => cartStore.liefernAbholen.abholen);

const itemPreis = computed(() => {
  return (item: GenericCartItem) => {
    if (item?.hasBeilagen && item.beilagen!.length > 0) {
      const totalBeilagenPreis = item.beilagen!.length * (item.beilagenPreis || 0);
      return item.price + totalBeilagenPreis;
    }
    return item?.price || 0;
  };
});

function onLiefern() { cartStore.setLiefernAbholen({ liefern: true, abholen: false }); }
function onAbholen() { cartStore.setLiefernAbholen({ liefern: false, abholen: true }); }

const showMwSt = computed(() => {
  if (bestellMail.value.length === 0) return false;
  return bestellMail.value[0]!.mwStOn === true;
});

const loadBestellMail = async () => {
  try {
    const response = await api.get(`/api/bestellmail`);
    bestellMail.value = response.data.map((item: BestellMailResponse) => ({
      ...item, password: "",
    }));
  } catch (error) { console.error(`Error fetching`, error); }
};

const bestellen = () => {
  if (genericCartItems.value.length === 0) {
    $q.notify({ message: "Dein Warenkorb ist leer!", icon: "warning", color: "negative", position: "top", timeout: 800 });
  } else { void router.push("/bestellung"); }
};

const getFullImageUrl = (imgUrl: string): string => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith("http")) return imgUrl;
  const apiBaseURL = getBaseURL();
  const normalizedBaseURL = apiBaseURL.endsWith("/") ? apiBaseURL : apiBaseURL + "/";
  return normalizedBaseURL + imgUrl.replace(/^\/+/, "");
};

const isOpen = ref(false);
const selectedItem = ref<GenericCartItem | null>(null);

const removeItem = (item: GenericCartItem) => {
  cartStore.deleteGenericCartItem(item.id, item.categoryName, item.selectedSize);
  $q.notify({ message: "Artikel entfernt", icon: "delete", color: "grey-8", position: "top", timeout: 1000 });
};

const editItem = (item: GenericCartItem) => {
  selectedItem.value = item;
  isOpen.value = true;
};

const totalAmount = computed(() => {
  return genericCartItems.value.reduce((total, item) => {
    return total + (itemPreis.value(item) * item.quantity);
  }, 0);
});

const MwSt = computed(() => {
  const mwStProzent = bestellMail.value[0]?.mwSt || 0;
  return totalAmount.value - totalAmount.value / (1 + mwStProzent / 100);
});

const totalFahrkosten = computed(() => {
  const fahrkostenZahl = fahrkosten.value?.[0]?.fahrkosten || 0;
  return totalAmount.value + fahrkostenZahl;
});

const bruttoPreis = computed(() => {
  const mwStProzent = bestellMail.value[0]?.mwSt || 0;
  return totalAmount.value / (1 + mwStProzent / 100);
});

async function loadFahrkosten() {
  try {
    const response = await api.get("/api/fahrkosten");
    fahrkosten.value = response.data;
  } catch (error) { console.error("Fehler", error); }
}

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    sauce.value = response.data;
  } catch (error) { console.error("Fehler", error); }
}

onMounted(async () => {
  await loadBestellMail();
  await loadFahrkosten();
  await loadSaucen();
});
</script>

<style scoped>
/* --- BASIS DESIGN (WIE CODE 1) --- */
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
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
}

.card-inner {
  padding: 40px 25px;
}

/* --- WARENKORB SPEZIFISCH --- */
.toggle-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-active {
  background: var(--q-secondary) !important;
  color: black !important;
  border-radius: 8px;
  font-weight: bold;
}

.toggle-inactive {
  color: #888;
}

.cart-item-row {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.summary-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.checkout-button {
  border-radius: 16px;
  font-weight: bold;
  box-shadow: 0 8px 25px rgba(var(--q-secondary), 0.2);
}

.opacity-2 { opacity: 0.2; }
.uppercase { text-transform: uppercase; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 15px; }
  .item-image { width: 50px; height: 50px; }
}
</style>