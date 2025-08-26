<template>
  <q-banner class="banner full-width text-accent q-gutter-y-sm">
    <h6 class="bannerText">
      <q-icon name="lunch_dining" class="bannerIcon" />
      Warenkorb
    </h6>
  </q-banner>

  <div class="above bg-white q-gutter-y-xs">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      deine Bestellung...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <q-list>
    <q-item-label class="flex q-mt-sm" style="justify-content: center">
      Ihr Warenkorb</q-item-label
    >

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
            height: 80px;
            min-height: 80px;
            max-height: 80px;
            box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
            border: 1px solid;
            border-color: rgb(204, 204, 204);
            justify-content: center;
          "
          class="q-mr-md items-center"
        />
        <q-item-section>
          <q-item-label>{{ item.name }} </q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
          <q-item-label caption>Größe: {{ item.selectedSize }}</q-item-label>
          <q-item-label caption>Anzahl: {{ item.quantity }}</q-item-label>
          <div class="flex row items-center q-mb-sm">
            <q-item-label caption
              >Preis:
              <q-chip dense color="info">
                {{ (item.price * item.quantity).toFixed(2) }}€</q-chip
              >
            </q-item-label>
          </div>
          <q-item-label v-if="item.anmerkung" caption>Anmerkung:</q-item-label>
          <q-item-label v-if="item.anmerkung" caption>{{
            item.anmerkung
          }}</q-item-label>
        </q-item-section>
        <q-separator vertical class="separatorH q-mr-sm" />
        <q-item-section class="full-width" style="max-width: 80px">
          <div class="flex row items-center q-mb-sm">
            <q-btn
              class="full-width"
              dense
              icon="delete"
              @click="removeItem(item)"
              color="negative"
            />
          </div>
          <div class="flex row items-center q-mb-sm">
            <q-btn
              @click="editItem(item)"
              icon="edit"
              class="full-width"
              dense
              color="secondary"
            />
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
        label="bestellung abschließen"
        icon="login"
        @click="bestellen"
      />
    </q-item-section>
  </q-item>

  <WarenkorbItemBearbeiten
    v-model:selectedItem="selectedItem"
    v-model:isOpen="isOpen"
  />
</template>
<script setup lang="ts">
import { useCartStore } from "src/store/cardStore";
import type { GenericCartItem } from "src/store/cardStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import WarenkorbItemBearbeiten from "./Dialog/WarenkorbItemBearbeiten.vue";
import type { BestellMail, BestellMailResponse } from "./types/BestellMailType";
import api from "src/boot/axios";

const router = useRouter();
const $q = useQuasar();
const cartStore = useCartStore();
const bestellMail = ref<BestellMail[]>([]);
const genericCartItems = computed(() => cartStore.genericCartItems);

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

const bestellen = () => {
  if (genericCartItems.value.length === 0) {
    $q.notify({
      message: "Dein Warenkorb ist leer! Bitte füge Artikel hinzu.",
      icon: "warning",
      color: "negative",
      textColor: "white",
      position: "top",
      timeout: 600,
    });
  } else {
    void router.push("/bestellung");
  }
};

const BASE_URL = "http://localhost:5008/";
const getFullImageUrl = (imgUrl: string): string => {
  if (!imgUrl) return "";
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  return BASE_URL + imgUrl;
};

const isOpen = ref(false);
const selectedItem = ref<GenericCartItem | null>(null);

const removeItem = (item: GenericCartItem) => {
  cartStore.deleteGenericCartItem(
    item.id,
    item.categoryName,
    item.selectedSize
  );
  $q.notify({
    message: "Artikel wurde entfernt",
    icon: "check",
    color: "positive",
    position: "top",
    timeout: 1000,
  });
};

const editItem = (item: GenericCartItem) => {
  selectedItem.value = item;
  isOpen.value = true;
};

const totalAmount = computed(() => {
  return genericCartItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const MwSt = computed(() => {
  const mwStProzent = bestellMail.value[0]!.mwSt;
  return totalAmount.value - totalAmount.value / (1 + mwStProzent / 100);
});

const bruttoPreis = computed(() => {
  return totalAmount.value / (1 + bestellMail.value[0]!.mwSt / 100);
});

onMounted(async () => {
  await loadBestellMail();
});
</script>

<style>
.lol {
  border: 1px solid;
}
.bannerImage {
  height: 230px;
}

.text {
  display: grid;
}
.separator {
  margin-left: auto;
  margin-right: auto;
}
.abstand {
  margin-bottom: 20px;
}
.bannerIcon {
  size: 30px;
}
.img {
  max-width: 900px;
  min-height: 1200px;
}

@media (max-width: 600px) {
  .img {
    max-width: 900px;
    min-height: 650px;
  }
  .bannerImage {
    height: 130px;
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
