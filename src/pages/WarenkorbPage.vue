<template>
  <q-banner class="banner full-width text-accent q-gutter-y-sm">
    <h6 class="bannerText">
      <q-icon name="lunch_dining" class="bannerIcon" />
      Warenkorb
    </h6>
  </q-banner>

  <div class="bg-white q-gutter-y-xs">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      deine Bestellung...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <q-list>
    <q-item-label
      class="flex q-mt-md text-accent"
      style="justify-content: center"
    >
      Ihr Warenkorb</q-item-label
    >

    <q-separator inset class="q-mt-sm" />

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
      <q-item-label class="text-subtitle1 text-grey-6 q-mx-sm">/</q-item-label>
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

    <q-separator class="q-mb-sm" inset />

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
          <q-item-label
            caption
            v-if="item.beilagen!.length > 0"
            class="flex column"
          >
            <span
              class="flex row"
              style="align-items: center"
              v-for="(beilage, index) in item.beilagen"
              :key="index"
            >
              <span v-if="index === 0" class="q-mr-xs">Beilagen:</span>
              <span v-else class="q-mr-xs" style="visibility: hidden"
                >Beilagen:</span
              >

              <q-chip dense size="sm" color="green-1" style="font-size: 12px">
                {{ beilage }} - {{ (item.beilagenPreis ?? 0).toFixed(2) }}€
              </q-chip>
            </span>
          </q-item-label>

          <q-item-label v-if="item.hasSizes" caption style="margin-top: -2px"
            >Größe:
            <q-chip
              dense
              size="sm"
              color="green-1"
              style="font-size: 12px; margin-left: 18px"
            >
              {{ item.selectedSize }}</q-chip
            ></q-item-label
          >
          <q-item-label caption style="margin-top: -2px"
            >Anzahl:
            <q-chip
              dense
              size="sm"
              color="green-1"
              style="font-size: 12px; margin-left: 14px"
            >
              {{ item.quantity }}</q-chip
            >
          </q-item-label>
          <div class="flex row items-center" style="margin-top: -2px">
            <q-item-label caption
              >Preis:
              <q-chip
                dense
                color="info"
                size="sm"
                style="font-size: 12px; margin-left: 20px"
              >
                {{ (itemPreis(item) * item.quantity).toFixed(2) }}€</q-chip
              >
            </q-item-label>
          </div>
          <q-item-section
            v-if="item.anmerkung"
            class="flex column text-grey-4 q-pa-xs"
            style="border: solid 1px; border-radius: 2px"
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

          <q-item-section class="full-width">
            <q-expansion-item
              class="text-caption text-grey-7 expansion-left"
              expand-separator
              label="Allergene"
            >
              <q-list
                v-for="allergen in filteredAllergene(item)"
                :key="allergen.id"
              >
                <q-item-label caption>
                  {{ allergen.name }}
                </q-item-label>
                <q-separator class="q-mt-xs" />
              </q-list>
            </q-expansion-item>
          </q-item-section>

          <q-item-section class="full-width">
            <q-expansion-item
              class="text-caption text-grey-7"
              expand-separator
              label="Zusatzstoffe"
            >
              <q-list
                v-for="zusatzstoff in filteredZusatzstoffe(item)"
                :key="zusatzstoff.id"
              >
                <q-item-label caption>
                  {{ zusatzstoff.name }}
                </q-item-label>
                <q-separator />
              </q-list>
            </q-expansion-item>
          </q-item-section>
        </q-item-section>
        <q-separator vertical class="separatorH q-mr-sm q-ml-xs" />
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
        >Gesammtsumme: {{ totalAmount.toFixed(2) }}€
      </q-item-label>

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
      <q-item-label v-if="liefern && fahrkosten[0]?.fahrkostenOn" caption
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
import { Notify, useQuasar } from "quasar";
import WarenkorbItemBearbeiten from "./Dialog/WarenkorbItemBearbeiten.vue";
import type { BestellMail, BestellMailResponse } from "./types/BestellMailType";
import type { Fahrkosten } from "./types/FahrkostenType";
import api, { getBaseURL } from "src/boot/axios";
import type { Allergene } from "./types/AllergeneType";
import type { Zusatzstoffe } from "./types/ZusatzstoffeType";

const router = useRouter();
const $q = useQuasar();
const cartStore = useCartStore();
const bestellMail = ref<BestellMail[]>([]);
const genericCartItems = computed(() => cartStore.genericCartItems);
const fahrkosten = ref<Fahrkosten[]>([]);
const allergene = ref<Allergene[]>([]);
const zusatzstoffe = ref<Zusatzstoffe[]>([]);

const liefern = computed(() => cartStore.liefernAbholen.liefern);
const abholen = computed(() => cartStore.liefernAbholen.abholen);

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

const filteredAllergene = computed(() => {
  return (item: GenericCartItem) => {
    if (!item?.allergeneIds) return [];
    return allergene.value.filter((allergen) =>
      item.allergeneIds!.includes(allergen.id)
    );
  };
});

const filteredZusatzstoffe = computed(() => {
  return (item: GenericCartItem) => {
    if (!item?.zusatzstoffeIds) return [];
    return zusatzstoffe.value.filter((zusatzstoff) =>
      item.zusatzstoffeIds!.includes(zusatzstoff.id)
    );
  };
});

function onLiefern() {
  cartStore.setLiefernAbholen({ liefern: true, abholen: false });
}

function onAbholen() {
  cartStore.setLiefernAbholen({ liefern: false, abholen: true });
}

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
  return genericCartItems.value.reduce((total, item) => {
    const itemTotalPrice = itemPreis.value(item) * item.quantity;
    return total + itemTotalPrice;
  }, 0);
});

const MwSt = computed(() => {
  const mwStProzent = bestellMail.value[0]!.mwSt;
  return totalAmount.value - totalAmount.value / (1 + mwStProzent / 100);
});

const totalFahrkosten = computed(() => {
  const fahrkostenZahl = fahrkosten.value?.[0]?.fahrkosten || 0;
  return totalAmount.value + fahrkostenZahl;
});

const bruttoPreis = computed(() => {
  return totalAmount.value / (1 + bestellMail.value[0]!.mwSt / 100);
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
    });
  }
}

async function getAllergeneZusatzstoffe() {
  try {
    const responeAllergene = await api.get("/api/allergene");
    const responseZusatzstoffe = await api.get("/api/zusatzstoffe");

    allergene.value = responeAllergene.data;
    zusatzstoffe.value = responseZusatzstoffe.data;
  } catch (error) {
    console.log("Fehler bem Laden der Allergene und Zusatzstoffe", error);
    Notify.create({
      type: "negative",
      position: "top",
      icon: "clear",
      message: "Fehler beim Laden der Allergene & Zusatzstoffe",
    });
  }
}

onMounted(async () => {
  await loadBestellMail();
  await loadFahrkosten();
  await getAllergeneZusatzstoffe();
});
</script>

<style>
.bannerIcon {
  size: 30px;
}
@media (max-width: 600px) {
  .img {
    max-width: 900px;
    min-height: 650px;
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
