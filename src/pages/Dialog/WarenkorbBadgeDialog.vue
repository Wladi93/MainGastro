<template>
  <q-dialog v-model="isOpen">
    <q-card class="full-width" style="min-width: 90vw">
      <q-list>
        <q-item-label
          class="text-caption flex q-mt-sm text-accent"
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
        <q-separator class="q-mt-sm q-mb-xs" inset />

        <q-item
          style="justify-content: center; align-items: center"
          v-if="genericCartItems.length === 0"
          class="full-width column flex"
        >
          <q-item-label caption>
            Es befinden sich keine Artikel in Ihrem Warenkorb...
          </q-item-label>
        </q-item>

        <q-item v-else class="full-width column flex">
          <q-card
            class="row flex full-width q-mb-xs q-pa-xs"
            v-for="item in genericCartItems"
            :key="item.id + '_' + item.sizes"
          >
            <q-img
              spinner-color="white"
              :src="getFullImageUrl(item.img)"
              :alt="item.name"
              style="
                border-radius: 6px;
                aspect-ratio: 1;
                max-width: 80px;
                width: 80px;
                min-width: 80px;
                min-height: 80px;
                max-height: 80px;
                height: 80px;
                box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
                border: 1px solid;
                border-color: rgb(204, 204, 204);
              "
              class="q-mr-md"
            />

            <q-item-section>
              <q-item-label>{{ item.name }} </q-item-label>
              <q-item-label caption>{{ item.description }}</q-item-label>
              <q-item-label caption
                >Größe: {{ item.selectedSize }}</q-item-label
              >
              <q-item-label v-if="item.anmerkung!.length > 0" caption
                >Nachricht:
              </q-item-label>
              <q-item-label caption>{{ item.anmerkung }}</q-item-label>
            </q-item-section>
            <q-separator vertical class="separatorH q-mr-sm" />
            <q-item-section>
              <div class="flex row items-center q-mb-sm">
                <q-item-label caption>Preis: </q-item-label>
                <q-chip dense color="info">
                  {{ (item.price * item.quantity).toFixed(2) }}€</q-chip
                >
              </div>
              <div class="flex row items-center q-mb-sm">
                <q-item-label caption>Anzahl:</q-item-label>
                <q-chip color="grey-3" dense>
                  {{ item.quantity }}
                </q-chip>
              </div>
            </q-item-section>
          </q-card>
        </q-item>
      </q-list>
      <q-separator class="q-mb-sm q-mt-xs" inset />

      <q-item-section
        v-if="genericCartItems.length > 0"
        class="flex column items-center"
      >
        <template v-if="showMwSt">
          <q-item-label class="text-black">
            Gesammtsumme inkl. MwSt: {{ totalAmount.toFixed(2) }}€
          </q-item-label>
          <q-item-label caption>
            davon MwSt.({{ bestellMail[0]?.mwSt }}%): {{ MwSt.toFixed(2) }}€
          </q-item-label>
          <q-item-label caption>
            Gesamtsumme ohne MwSt.: {{ bruttoPreis.toFixed(2) }}€
          </q-item-label>
        </template>

        <template v-else>
          <q-item-label class="text-black">
            Gesammtsumme: {{ totalAmount.toFixed(2) }}€
          </q-item-label>
        </template>
      </q-item-section>
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
import api from "src/boot/axios";
import { EventBus } from "src/utils/eventBus";

const router = useRouter();
const cartStore = useCartStore();
const isOpen = defineModel<boolean>("isOpen", { default: false });
const genericCartItems = computed(() => cartStore.genericCartItems);
const bestellMail = ref<BestellMail[]>([]);
const showMwSt = computed(() => {
  if (bestellMail.value.length === 0) return false;
  return bestellMail.value[0]!.mwStOn === true;
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

function closeDialog() {
  isOpen.value = false;
}

const getFullImageUrl = (imgUrl: string): string => {
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }

  const apiBaseURL = process.env.VITE_API_BASE_URL || "http://localhost:5008";
  const isLocalDevelopment = apiBaseURL.includes("localhost");

  const imageBaseURL = isLocalDevelopment
    ? "http://localhost:5008/"
    : apiBaseURL;

  const normalizedBaseURL = imageBaseURL.endsWith("/")
    ? imageBaseURL
    : imageBaseURL + "/";
  const cleanedImgUrl = imgUrl.replace(/^\/+/, "");

  return normalizedBaseURL + cleanedImgUrl;
};

const zumWarenkorb = async () => {
  await router.push("/warenkorb");
};

const totalAmount = computed(() => {
  const totalAmountcartItems = genericCartItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return totalAmountcartItems;
});

const bruttoPreis = computed(() => {
  return totalAmount.value - MwSt.value;
});

const MwSt = computed(() => {
  const mwStProzent = bestellMail.value[0]!.mwSt;
  return totalAmount.value * (mwStProzent / 100);
});

onMounted(() => {
  void (async () => {
    await loadBestellMail();

    EventBus.on("bestellmail-updated", () => {
      void loadBestellMail();
    });
  })();
});

onUnmounted(() => {
  EventBus.off("bestellmail-updated");
});
onMounted(async () => {
  await loadBestellMail();
});
</script>
