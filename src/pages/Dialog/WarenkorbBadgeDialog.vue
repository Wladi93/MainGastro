<template>
  <q-dialog v-model="isOpen" backdrop-filter="blur(10px)">
    <q-card class="premium-glass-card shadow-24 flex column no-wrap" style="min-width: 90vw; max-height: 85vh; border-radius: 28px;">
      
      <q-card-section class="text-center q-pb-none">
        <q-item-label class="text-overline text-secondary text-weight-bold tracking-widest">
          Bestellübersicht
        </q-item-label>
        <q-separator dark inset class="q-mt-sm opacity-2" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row justify-center items-center selector-container">
          <q-btn
            v-if="bestellMail[0]?.liefernOn"
            icon="moped" flat no-caps
            class="col btn-choice"
            :class="{ 'choice-active': liefern }"
            label="Liefern"
            @click="onLiefern"
          />
          <q-btn
            v-if="bestellMail[0]?.abholenOn"
            icon="storefront" flat no-caps
            class="col btn-choice"
            :class="{ 'choice-active': abholen }"
            label="Abholen"
            @click="onAbholen"
          />
        </div>
      </q-card-section>

      <q-card-section class="col scroll q-pa-md">
        <div v-if="genericCartItems.length === 0" class="text-center q-pa-xl">
          <q-icon name="shopping_basket" size="64px" color="grey-7" class="q-mb-md opacity-4" />
          <q-item-label caption class="text-grey-5">
            Warenkorb ist leer...
          </q-item-label>
        </div>

        <q-list v-else :key="cartKey" class="q-gutter-y-sm">
          <q-card
            v-for="item in genericCartItems"
            :key="`${item.id}_${item.categoryName}_${item.selectedSize || 'no-size'}_${item.anmerkung || 'no-note'}`"
            class="item-glass-card row no-wrap q-pa-sm items-center"
            flat
          >
            <q-img spinner-color="white" :src="getFullImageUrl(item.img)" class="item-image q-mr-md" />

            <q-item-section class="col">
              <q-item-label class="text-white text-weight-bold text-subtitle1">{{ item.name }}</q-item-label>
              <div class="row q-gutter-xs q-mt-xs">
                <q-chip v-if="item.saucenIds?.length" dense size="12px" outline color="secondary" text-color="dark">
                  {{ getSauceNameForItem(item) }}
                </q-chip>
                <q-chip v-for="(beilage, idx) in item.beilagen" :key="idx" outline dense size="12px" color="secondary" text-color="dark">
                  + {{ beilage }}
                </q-chip>
                <q-chip v-if="item.hasSizes" dense size="12px" outline color="secondary" text-color="dark">
                  {{ item.selectedSize }}
                </q-chip>
              </div>
              <div v-if="item.anmerkung" class="text-caption text-italic text-grey-5 q-mt-xs">
                "{{ item.anmerkung }}"
              </div>
            </q-item-section>

            <q-item-section side class="text-right">
              <div class="text-caption text-grey-6">x{{ item.quantity }}</div>
              <div class="text-subtitle2 text-secondary text-weight-bolder">
                {{ (itemPreis(item) * item.quantity).toFixed(2) }}€
              </div>
            </q-item-section>
          </q-card>
        </q-list>

<div v-if="genericCartItems.length > 0" class="summary-box q-pa-md q-mt-md">
  <template v-if="showMwSt">
    <div class="row justify-between items-center text-subtitle1 text-white text-weight-bold">
      <span>Gesamtsumme (Brutto):</span>
      <span class="text-secondary">
        {{ (liefern && fahrkosten[0]?.fahrkostenOn ? totalFahrkosten : totalAmount).toFixed(2) }}€
      </span>
    </div>
    
    <q-separator dark class="q-my-sm opacity-1" />
    
    <div v-if="liefern && fahrkosten[0]?.fahrkostenOn" class="row justify-between text-caption text-grey-5">
      <span>Fahrkosten:</span>
      <span>{{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€</span>
    </div>

    <div class="row justify-between text-caption text-grey-6 q-mt-xs">
      <span>darin enthaltene MwSt. ({{ bestellMail[0]?.mwSt }}%):</span>
      <span>{{ MwSt.toFixed(2) }}€</span>
    </div>

    <div class="row justify-between text-caption text-grey-6">
      <span>Netto-Betrag:</span>
      <span>{{ bruttoPreis.toFixed(2) }}€</span>
    </div>
  </template>

  <template v-else>
    <div class="row justify-between items-center text-h6 text-white text-weight-bolder">
      <span>Gesamtsumme:</span>
      <span class="text-secondary">
        {{ (liefern && fahrkosten[0]?.fahrkostenOn ? totalFahrkosten : totalAmount).toFixed(2) }}€
      </span>
    </div>
    <div v-if="liefern && fahrkosten[0]?.fahrkostenOn" class="row justify-between text-caption text-grey-5 q-mt-xs">
      <span>Inkl. Fahrkosten:</span>
      <span>{{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€</span>
    </div>
  </template>
</div>
      </q-card-section>

      <q-separator dark class="opacity-2" />
      <q-card-actions class="q-pa-md column q-gutter-y-sm dialog-footer">
        <q-btn
          color="secondary" text-color="dark"
          class="full-width premium-btn"
          label="Zum Warenkorb"
          icon="shopping_basket"
          @click="zumWarenkorb"
        />
        <q-btn flat class="full-width text-grey-6 q-mb-xs" label="Abbrechen" @click="closeDialog" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useCartStore } from "src/store/cardStore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import type {
  BestellMail,
  BestellMailResponse,
} from "../types/BestellMailType";
import api, { getBaseURL } from "src/boot/axios";
import { EventBus } from "src/utils/eventBus";
import type { Fahrkosten } from "../types/FahrkostenType";
import { useQuasar } from "quasar";
import type { SaucenType } from "../types/SaucenType";

const $q = useQuasar();
const router = useRouter();
const cartStore = useCartStore();
const isOpen = defineModel<boolean>("isOpen", { default: false });
const genericCartItems = computed(() => cartStore.genericCartItems);
const bestellMail = ref<BestellMail[]>([]);
const showMwSt = computed(() => {
  if (bestellMail.value.length === 0) return false;
  return bestellMail.value[0]!.mwStOn === true;
});
const fahrkosten = ref<Fahrkosten[]>([]);
const sauce = ref<SaucenType[]>([]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSauceNameForItem = (item: any) => {
  if (!item.saucenIds || item.saucenIds.length === 0) return "";
  const sauceId = item.saucenIds[0];
  const foundSauce = sauce.value.find((s) => s.id === sauceId);
  return foundSauce?.name || "";
};

const itemPreis = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (item: any) => {
    if (item?.hasBeilagen && item.beilagen?.length > 0) {
      const totalBeilagenPreis =
        item.beilagen.length * (item.beilagenPreis || 0);
      return item.price + totalBeilagenPreis;
    }
    return item?.price || 0;
  };
});

const liefern = computed(() => cartStore.liefernAbholen.liefern);
const abholen = computed(() => cartStore.liefernAbholen.abholen);

function onLiefern() {
  cartStore.setLiefernAbholen({ liefern: true, abholen: false });
}

function onAbholen() {
  cartStore.setLiefernAbholen({ liefern: false, abholen: true });
}

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

function closeDialog() {
  isOpen.value = false;
}

const cartKey = computed(() => {
  return genericCartItems.value
    .map(
      (item) =>
        `${item.id}_${item.categoryName}_${item.selectedSize || "no-size"}_${item.anmerkung || "no-note"}`
    )
    .join(",");
});

const getFullImageUrl = (imgUrl: string): string => {
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }

  const apiBaseURL = getBaseURL();
  const normalizedBaseURL = apiBaseURL.endsWith("/")
    ? apiBaseURL
    : apiBaseURL + "/";
  const cleanedImgUrl = imgUrl.replace(/^\/+/, "");

  return normalizedBaseURL + cleanedImgUrl;
};

const zumWarenkorb = async () => {
  if (router.currentRoute.value.path === "/warenkorb") {
    closeDialog();
  } else {
    await router.push("/warenkorb");
  }
};

const totalFahrkosten = computed(() => {
  const fahrkostenZahl = fahrkosten.value?.[0]?.fahrkosten || 0;
  return totalAmount.value + fahrkostenZahl;
});

const totalAmount = computed(() => {
  return genericCartItems.value.reduce((total, item) => {
    const itemTotalPrice = itemPreis.value(item) * item.quantity;
    return total + itemTotalPrice;
  }, 0);
});

const bruttoPreis = computed(() => {
  return totalAmount.value - MwSt.value;
});

const MwSt = computed(() => {
  const mwStProzent = bestellMail.value[0]!.mwSt;
  return totalAmount.value * (mwStProzent / 100);
});

async function loadFahrkosten() {
  try {
    const response = await api.get("/api/fahrkosten");

    fahrkosten.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Fahrkosten:", error, fahrkosten);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Laden der Fahrkosten",
      icon: "clear",
    });
  }
}

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    sauce.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Saucen", error);
  }
}

onMounted(() => {
  void (async () => {
    await loadBestellMail();

    EventBus.on("bestellmail-updated", () => {
      void loadBestellMail();
    });
    EventBus.on("fahrkosten-updated", () => {
      void loadFahrkosten();
    });
  })();
});

onUnmounted(() => {
  EventBus.off("bestellmail-updated");
  EventBus.off("fahrkosten-updated");
});
onMounted(async () => {
  await loadFahrkosten();
  await loadBestellMail();
  await loadSaucen();
});
</script>
<style scoped>
/* WICHTIG: Die Card darf nicht wachsen, der Inhalt muss scrollen */
.premium-glass-card {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.dialog-footer {
  /* Berücksichtigt den Balken unten beim iPhone */
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: rgba(18, 18, 18, 0.98);
}

.selector-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-choice {
  color: #888;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.choice-active {
  background: rgba(255, 255, 255, 0.1) !important;
  color: var(--q-secondary) !important;
  font-weight: bold;
}

.item-glass-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.item-image {
  width: 55px; height: 55px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.premium-btn {
  border-radius: 16px;
  font-weight: 900;
  height: 54px;
}

.tracking-widest { letter-spacing: 0.15em; }
.opacity-1 { opacity: 0.1; }
.opacity-2 { opacity: 0.2; }
.opacity-4 { opacity: 0.4; }
</style>