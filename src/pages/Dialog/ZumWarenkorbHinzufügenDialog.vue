<template>
  <q-dialog v-model="isOpen">
    <q-card class="full-width">
      <q-list v-if="selectedItem">
        <q-item>
          <q-item-section class="flex items-center">
            <q-item-label caption> Artikel</q-item-label>
          </q-item-section>
          <q-separator></q-separator>
        </q-item>
        <q-item class="full-width">
          <q-card class="full-width flex row q-pa-sm">
            <q-img
              spinner-color="white"
              :src="getFullImageUrl(selectedItem.img)"
              :alt="selectedItem.name"
              style="
                border-radius: 6px;
                aspect-ratio: 1;
                max-width: 80px;
                width: 80px;
                min-width: 80px;
                height: auto;
                box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
                border: 1px solid;
                border-color: rgb(204, 204, 204);
              "
              class="q-mr-md"
            />
            <q-item-section>
              <q-item-label> {{ selectedItem.name }}</q-item-label>

              <q-item-label caption v-if="hasSizes && selectedSize">
                Größe: {{ selectedSize }}
              </q-item-label>
            </q-item-section>
            <q-separator inset vertical class="q-mr-md" />
            <q-item-section>
              <div class="flex row items-center q-mb-sm">
                <q-item-label caption>Preis:</q-item-label>
                <q-chip color="info"
                  >{{
                    (
                      currentPrice +
                      selectedBeilagen.length * beilagenEinzelpreis
                    ).toFixed(2)
                  }}€</q-chip
                >
              </div>
              <q-item-label caption>Anzahl: {{ anzahl }}</q-item-label>
            </q-item-section>
          </q-card>
        </q-item>
        <q-item class="flex column">
          <q-item-section
            style="border: 1px solid; border-radius: 4px"
            class="q-pa-sm text-grey-4"
          >
            <q-item-label caption>Beschreibung:</q-item-label>
            <q-item-label class="text-grey-8" style="font-size: 12px">{{
              selectedItem.description
            }}</q-item-label></q-item-section
          >
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              style="margin-bottom: -20px"
              filled
              v-model.number="anzahl"
              label="Anzahl"
              label-color="secondary"
              stack-label
              type="number"
              :rules="[(val) => val > 0 || 'Anzahl muss mindestens 1 sein']"
            >
              <template v-slot:append>
                <div class="quantity-controls">
                  <q-btn
                    flat
                    dense
                    icon="add"
                    size="sm"
                    @click="increaseQuantity"
                    :disable="anzahl >= 99"
                  />
                  <q-btn
                    flat
                    dense
                    icon="remove"
                    size="sm"
                    @click="decreaseQuantity"
                    :disable="anzahl <= 1"
                  />
                </div>
              </template>
            </q-input>
          </q-item-section>
        </q-item>

        <q-item v-if="hasSizes">
          <q-item-section>
            <q-select
              filled
              v-model="selectedSize"
              :options="sizeOptions"
              label="bitte Größe auswählen"
              color="secondary"
              option-label="label"
              option-value="value"
              emit-value
              map-options
            />
          </q-item-section>
        </q-item>

        <q-item class="flex column" v-if="selectedItem.hasSaucen">
          <q-select
            filled
            v-model="selectedSauce"
            :options="filteredSaucen"
            label="Sauce auswählen"
            color="accent"
            option-label="name"
            option-value="name"
            emit-value
            map-options
          />
        </q-item>

        <q-item class="flex column" v-if="selectedItem.hasBeilagen">
          <q-select
            filled
            v-model="selectedBeilagen"
            :options="beilagenOptions"
            label="Beilagen auswählen"
            color="accent"
            option-label="label"
            option-value="value"
            multiple
            use-chips
            emit-value
            map-options
            :key="selectedSize"
          />
        </q-item>

        <q-item>
          <q-item-section>
            <q-input
              class="q-mb-sm"
              filled
              v-model="anmerkung"
              label="Anmerkuung"
              label-color="secondary"
              stack-label
              placeholder="hier kann eine Nachricht bzgl. der Bestellung hinterlassen werden..."
              type="textarea"
              :rules="[() => true]"
            />
          </q-item-section>
        </q-item>
        <q-item class="full-width">
          <q-expansion-item
            class="full-width text-grey-8"
            expand-separator
            label="Allergene"
            header-class="bg-grey-3"
            icon="list"
            dense
          >
            <q-list
              class="q-mt-xs"
              v-for="allergen in filteredAllergene"
              :key="allergen.id"
            >
              <q-item-label caption>{{ allergen.name }},</q-item-label>
            </q-list>
          </q-expansion-item>
        </q-item>

        <q-item>
          <q-expansion-item
            class="full-width text-grey-8"
            expand-separator
            label="Zusatzstoffe"
            header-class="bg-grey-3"
            icon="list"
            dense
            style="margin-top: -10px"
          >
            <q-list
              class="q-mt-xs"
              v-for="zusatzstoff in filteredZusatzstoffe"
              :key="zusatzstoff.id"
            >
              <q-item-label caption>{{ zusatzstoff.name }}</q-item-label>
            </q-list>
          </q-expansion-item>
        </q-item>

        <q-item>
          <q-item-section>
            <q-btn
              icon="shopping_cart_checkout"
              color="secondary"
              label="in den Warenkorb"
              @click="addToCart"
            />
            <q-btn
              class="q-mt-xs"
              flat
              color="negative"
              label="abbrechen"
              @click="closeDialog"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { CategoryItem } from "../types/CategoryItem";
import { Notify, useQuasar } from "quasar";
import { useCartStore } from "src/store/cardStore";
import type { BeilagenName, BeilagenPreise } from "../types/BeilagenType";
import api, { getBaseURL } from "src/boot/axios";
import type { Allergene } from "../types/AllergeneType";
import type { Zusatzstoffe } from "../types/ZusatzstoffeType";
import type { SaucenType } from "../types/SaucenType";

const saucen = ref<SaucenType[]>([]);
const selectedSauce = ref<string>("");
const allergene = ref<Allergene[]>([]);
const zusatzstoffe = ref<Zusatzstoffe[]>([]);
const cartStore = useCartStore();
const anzahl = ref(1);

const $q = useQuasar();
const beilageName = ref<BeilagenName[]>([]);
const selectedBeilagen = ref<string[]>([]);

const filteredSaucen = computed(() => {
  if (!selectedItem.value?.saucenIds) return [];
  return saucen.value.filter((sauce) =>
    selectedItem.value?.saucenIds.includes(sauce.id)
  );
});

const filteredAllergene = computed(() => {
  if (!selectedItem.value?.allergeneIds) return [];
  return allergene.value.filter((allergen) =>
    selectedItem.value?.allergeneIds.includes(allergen.id)
  );
});

const filteredZusatzstoffe = computed(() => {
  if (!selectedItem.value?.zusatzstoffeIds) return [];
  return zusatzstoffe.value.filter((zusatzstoff) =>
    selectedItem.value?.zusatzstoffeIds.includes(zusatzstoff.id)
  );
});

const beilagenOptions = computed(() => {
  return beilageName.value.map((beilage) => {
    const beilagenPreis =
      beilagenPreise.value.find((preis) => preis.id === beilage.id) ||
      beilagenPreise.value[0];

    let price = 0;
    if (beilagenPreis && selectedSize.value) {
      const sizeLower = selectedSize.value.toLowerCase();
      if (sizeLower.includes("klein")) {
        price = beilagenPreis.kleinpreis;
      } else if (sizeLower.includes("mittel")) {
        price = beilagenPreis.mittelpreis;
      } else if (sizeLower.includes("groß") || sizeLower.includes("gross")) {
        price = beilagenPreis.grosspreis;
      } else if (sizeLower.includes("familie")) {
        price = beilagenPreis.familiepreis;
      } else {
        price = beilagenPreis.kleinpreis;
      }
    }

    return {
      label:
        price > 0
          ? `${beilage.beilageName} - ${price.toFixed(2)}€`
          : beilage.beilageName,
      value: beilage.beilageName,
      beilageName: beilage.beilageName,
      price: price,
    };
  });
});

const beilagenEinzelpreis = computed(() => {
  if (!selectedSize.value || beilagenPreise.value.length === 0) return 0;

  const beilagenPreis = beilagenPreise.value[0];
  const sizeLower = selectedSize.value.toLowerCase();

  if (sizeLower.includes("klein")) {
    return beilagenPreis!.kleinpreis;
  } else if (sizeLower.includes("mittel")) {
    return beilagenPreis!.mittelpreis;
  } else if (sizeLower.includes("groß") || sizeLower.includes("gross")) {
    return beilagenPreis!.grosspreis;
  } else if (sizeLower.includes("familie")) {
    return beilagenPreis!.familiepreis;
  }
  return beilagenPreis!.kleinpreis;
});

const beilagenMitPreisen = selectedBeilagen.value.map((beilageName) => ({
  name: beilageName,
  price: beilagenEinzelpreis.value,
}));

const beilagenPreise = ref<BeilagenPreise[]>([]);
const anmerkung = ref("");
const isOpen = defineModel<boolean>("isOpen", { default: false });
const selectedItem = defineModel<CategoryItem | null>("selectedItem", {
  required: true,
});
const categoryName = defineModel<string>("categoryName", {
  required: true,
});

function closeDialog() {
  isOpen.value = false;
  selectedBeilagen.value = [];
}

const increaseQuantity = () => {
  if (anzahl.value < 99) {
    anzahl.value++;
  }
};

const decreaseQuantity = () => {
  if (anzahl.value > 1) {
    anzahl.value--;
  }
};

async function loadBeilagen() {
  try {
    const response = await api.get("/api/beilagen/beilagenname");
    beilageName.value = response.data;

    const responsePreise = await api.get("/api/beilagen/beilagenpreise");
    beilagenPreise.value = responsePreise.data;
  } catch (error) {
    console.error("Fehler beim Laden der Fahrkosten:", error, beilageName);
  }
}

onMounted(async () => {
  await loadBeilagen();
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

const hasSizes = computed(() => {
  return selectedItem.value && selectedItem.value.hasSizes === true;
});

const selectedSize = ref<string>("");

const sizeOptions = computed(() => {
  if (!selectedItem.value?.sizes) return [];

  return [...selectedItem.value.sizes]
    .sort((a, b) => a.price - b.price)
    .map((size) => ({
      label: `${size.sizeName} - ${size.price.toFixed(2)}€`,
      value: size.sizeName,
    }));
});

const currentPrice = computed(() => {
  if (!selectedItem.value) return 0;

  if (hasSizes.value && selectedItem.value.sizes && selectedSize.value) {
    const sizeData = selectedItem.value.sizes.find(
      (size) => size.sizeName === selectedSize.value
    );
    return sizeData ? sizeData.price : selectedItem.value.price || 0;
  }

  return selectedItem.value.price || 0;
});

const calculatedPrice = computed(() => {
  return currentPrice.value * anzahl.value;
});

const addToCart = () => {
  if (selectedItem.value) {
    if (hasSizes.value && !selectedSize.value) {
      $q.notify({
        message: "Bitte wählen Sie eine Größe aus",
        icon: "warning",
        color: "warning",
        position: "top",
        timeout: 2000,
      });
      return;
    }

    $q.loading.show();

    try {
      const cartItem = {
        id: selectedItem.value.id,
        name: selectedItem.value.name,
        description: selectedItem.value.description,
        img: selectedItem.value.img,
        price: currentPrice.value,
        quantity: anzahl.value,
        categoryName: categoryName.value,
        selectedSize: hasSizes.value ? selectedSize.value : undefined,
        totalPrice: calculatedPrice.value,
        anmerkung: anmerkung.value,
        hasSizes: selectedItem.value.hasSizes,
        beilagen: selectedBeilagen.value,
        beilagenMitPreis: beilagenMitPreisen,
        beilagenPreis: beilagenEinzelpreis.value,
        hasBeilagen: selectedItem.value.hasBeilagen,
        allergeneIds: selectedItem.value.allergeneIds,
        zusatzstoffeIds: selectedItem.value.zusatzstoffeIds,
        saucenIds: selectedItem.value.saucenIds,
        hasSausen: selectedItem.value.saucenIds,
      };

      cartStore.addGenericToCart(cartItem);

      $q.notify({
        message: "Artikel wurde zum Warenkorb hinzugefügt",
        icon: "check",
        type: "positive",
        position: "top",
        timeout: 400,
      });

      closeDialog();
      anmerkung.value = "";
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      $q.notify({
        message: "Fehler beim Hinzufügen zum Warenkorb",
        icon: "error",
        type: "negative",
        position: "top",
        timeout: 2000,
      });
    } finally {
      $q.loading.hide();
    }
  }
};

watch(
  () => selectedItem.value,
  (newItem) => {
    if (newItem) {
      anzahl.value = 1;
      selectedBeilagen.value = [];
      if (newItem.sizes && newItem.sizes.length > 0) {
        const mittelSize = newItem.sizes.find((size) =>
          size.sizeName.toLowerCase().includes("klein")
        );
        selectedSize.value = mittelSize
          ? mittelSize.sizeName
          : newItem.sizes[0]!.sizeName;
      } else {
        selectedSize.value = "";
      }
    }
  },
  { immediate: true }
);

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

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    saucen.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Saucen", error);
  }
}

onMounted(async () => {
  await getAllergeneZusatzstoffe();
  await loadSaucen();
});
</script>
<style scoped>
.quantity-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
