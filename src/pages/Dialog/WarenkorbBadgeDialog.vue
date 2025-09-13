<template>
  <q-dialog v-model="isOpen">
    <q-card class="full-width" style="min-width: 90vw">
      <q-list>
        <q-item-label
          class="text-caption flex q-mt-md text-accent"
          style="justify-content: center; font-size: 14px"
        >
          Ihr Warenkorb
          <q-icon
            name="shopping_cart"
            size="xs"
            color="accent"
            class="q-ml-sm"
          />
        </q-item-label>
        <q-separator class="q-mt-sm" inset />

        <q-item
          class="flex row"
          style="justify-content: center; align-items: center"
        >
          <q-btn
            v-if="bestellMail[0]?.liefernOn"
            icon="moped"
            dense
            flat
            :color="liefern ? 'accent' : 'grey-6'"
            label="Liefern"
            @click="onLiefern"
          />
          <q-item-label class="text-subtitle1 text-grey-6 q-mx-sm"
            >/</q-item-label
          >
          <q-btn
            v-if="bestellMail[0]?.abholenOn"
            icon="storefront"
            dense
            flat
            :color="abholen ? 'accent' : 'grey-6'"
            label="abholen"
            @click="onAbholen"
          />
        </q-item>

        <q-separator inset class="q-mb-md" />

        <q-item
          style="justify-content: center; align-items: center"
          v-if="genericCartItems.length === 0"
          class="full-width column flex"
        >
          <q-item-label caption>
            Es befinden sich keine Artikel in Ihrem Warenkorb...
          </q-item-label>
        </q-item>

        <q-list
          :key="cartKey"
          separator
          v-else
          class="column flex"
          style="margin-left: 16px; margin-right: 16px"
        >
          <q-card
            class="row flex full-width q-mb-xs q-pa-xs"
            v-for="item in genericCartItems"
            :key="`${item.id}_${item.categoryName}_${item.selectedSize || 'no-size'}_${item.anmerkung || 'no-note'}`"
          >
            <q-img
              spinner-color="white"
              :src="getFullImageUrl(item.img)"
              :alt="item.name"
              style="
                border-radius: 6px;
                aspect-ratio: 1;
                max-width: 50px;
                width: 50px;
                min-width: 50px;
                min-height: 50px;
                max-height: 50px;
                height: 50px;
                box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
                border: 1px solid;
                border-color: rgb(204, 204, 204);
              "
              class="q-mr-md"
            />

            <q-item-section class="q-mr-xl full-width">
              <q-item-label>{{ item.name }} </q-item-label>

              <q-item-label
                caption
                v-if="item.beilagen!.length > 0"
                class="flex column"
              >
                Beilagen:

                <span
                  class="text-caption"
                  v-for="(beilage, index) in item.beilagen"
                  :key="index"
                >
                  <q-chip
                    dense
                    size="sm"
                    style="font-size: 12px; margin-left: -1px"
                    color="green-1"
                  >
                    {{ beilage }} {{ (item.beilagenPreis ?? 0).toFixed(2) }}€
                  </q-chip>
                </span>
              </q-item-label>

              <q-item-label
                class="flex row"
                style="align-items: center"
                caption
                v-if="item.hasSizes"
                >Größe:
                <q-chip
                  color="green-1"
                  dense
                  size="sm"
                  style="font-size: 12px"
                  caption
                >
                  {{ item.selectedSize }}</q-chip
                >
              </q-item-label>

              <q-item-section
                v-if="item.anmerkung"
                class="flex column text-grey-4"
              >
                <q-item-label v-if="item.anmerkung" caption
                  >Anmerkung:</q-item-label
                >
                <q-item-label
                  v-if="item.anmerkung"
                  class="text-black"
                  style="font-size: 12px"
                  caption
                  >{{ item.anmerkung }}</q-item-label
                ></q-item-section
              >
            </q-item-section>
            <q-separator vertical />
            <q-item-section>
              <div class="flex row items-center q-mb-xs q-ml-md">
                <q-item-label caption>Preis: </q-item-label>
                <q-chip dense color="info">
                  {{ (itemPreis(item) * item.quantity).toFixed(2) }}€</q-chip
                >
              </div>
              <div class="flex row items-center q-ml-md">
                <q-item-label caption>Anzahl:</q-item-label>
                <q-chip color="green-1" dense>
                  {{ item.quantity }}
                </q-chip>
              </div>
            </q-item-section>
          </q-card>
        </q-list>
      </q-list>
      <q-separator class="q-mb-sm q-mt-md" inset />

      <q-item-section
        style="
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        "
        v-if="genericCartItems.length > 0"
        class="flex column items-center"
      >
        <template v-if="showMwSt">
          <q-item-label
            v-if="liefern && fahrkosten[0]?.fahrkostenOn"
            class="text-accent"
          >
            Gesammtsumme inkl. MwSt:
            {{ totalFahrkosten.toFixed(2) }}€
            <q-separator class="q-my-xs" />
          </q-item-label>

          <q-item-label
            v-if="abholen || !fahrkosten[0]?.fahrkostenOn"
            class="text-accent"
          >
            Gesammtsumme inkl. MwSt:
            {{ totalAmount.toFixed(2) }}€
            <q-separator class="q-my-xs" />
          </q-item-label>

          <q-item-label v-if="liefern && fahrkosten[0]?.fahrkostenOn" caption
            >+<q-icon name="moped" class="q-mr-xs q-ml-xs" />Fahrkosten:
            {{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€</q-item-label
          >

          <q-item-label v-if="liefern" caption
            >Gesammtsumme: {{ totalAmount.toFixed(2) }}€</q-item-label
          >

          <q-item-label caption>
            davon MwSt.({{ bestellMail[0]?.mwSt }}%): {{ MwSt.toFixed(2) }}€
          </q-item-label>
          <q-item-label caption>
            Gesamtsumme ohne MwSt.: {{ bruttoPreis.toFixed(2) }}€
          </q-item-label>
        </template>

        <template v-else>
          <q-item-label
            v-if="liefern && fahrkosten[0]?.fahrkostenOn"
            class="text-accent"
          >
            Gesammtsumme: {{ totalFahrkosten.toFixed(2) }}€
            <q-separator class="q-my-xs" />
          </q-item-label>
          <q-item-label v-if="liefern && fahrkosten[0]!.fahrkostenOn" caption
            >+<q-icon name="moped" class="q-mr-xs q-ml-xs" />Fahrkosten:
            {{ fahrkosten[0]?.fahrkosten.toFixed(2) }}€</q-item-label
          >
          <q-item-label v-if="liefern && fahrkosten[0]?.fahrkostenOn" caption
            >Gesammtsumme Artikel: {{ totalAmount.toFixed(2) }}€</q-item-label
          >

          <q-item-label
            v-if="abholen || !fahrkosten[0]?.fahrkostenOn"
            class="text-accent"
          >
            Gesammtsumme: {{ totalAmount.toFixed(2) }}€
            <q-separator class="q-my-xs" />
          </q-item-label>
        </template>
      </q-item-section>

      <q-separator class="q-mt-sm q-mb-sm" inset />

      <q-item class="full-width">
        <q-item-section>
          <q-btn
            color="secondary"
            label="zum Warenkorb"
            icon="login"
            @click="zumWarenkorb"
          />
          <q-btn @click="closeDialog" flat color="negative" label="Abbrechen" />
        </q-item-section>
      </q-item>
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
});
</script>
<style></style>
