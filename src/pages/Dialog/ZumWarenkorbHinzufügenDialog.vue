<template>
  <q-dialog v-model="isOpen" backdrop-filter="blur(10px)" persistent>
    <q-card class="premium-glass-card shadow-24 flex column no-wrap" style="min-width: 90vw; max-height: 85vh; border-radius: 28px;">
      
      <q-card-section class="text-center q-pb-none">
        <q-item-label class="text-overline text-secondary text-weight-bold tracking-widest">
          Artikel Details
        </q-item-label>
        <q-separator dark inset class="q-mt-sm opacity-2" />
      </q-card-section>

      <q-card-section class="col scroll q-pa-md">
        <q-list v-if="selectedItem" class="q-gutter-y-md">
          
          <q-item class="q-pa-none">
            <q-card class="item-glass-card full-width flex row q-pa-sm items-center" flat>
              <q-img
                spinner-color="white"
                :src="getFullImageUrl(selectedItem.img)"
                class="item-image q-mr-md"
              />
              <q-item-section>
                <q-item-label class="text-white text-weight-bold text-subtitle1"> {{ selectedItem.name }}</q-item-label>
                <q-item-label caption class="text-secondary" v-if="hasSizes && selectedSize">
                  Auswahl: {{ selectedSize }}
                </q-item-label>
              </q-item-section>
              <q-item-section side class="text-right">
                <div class="text-subtitle1 text-secondary text-weight-bolder">
                  {{ (currentPrice + selectedBeilagen.length * beilagenEinzelpreis).toFixed(2) }}€
                </div>
              </q-item-section>
            </q-card>
          </q-item>

          <div class="summary-box q-pa-md full-width">
            <q-item-label caption class="text-secondary q-mb-xs">Beschreibung</q-item-label>
            <q-item-label class="text-grey-4" style="font-size: 13px; line-height: 1.4;">
              {{ selectedItem.description }}
            </q-item-label>
          </div>

          <q-input
            filled dark color="secondary" label-color="secondary" stack-label
            v-model.number="anzahl"
            label="Anzahl"
            type="number"
            class="custom-input full-width"
          >
            <template v-slot:append>
              <div class="quantity-controls">
                <q-btn flat dense icon="add" size="sm" color="secondary" @click="increaseQuantity" :disable="anzahl >= 99" />
                <q-btn flat dense icon="remove" size="sm" color="secondary" @click="decreaseQuantity" :disable="anzahl <= 1" />
              </div>
            </template>
          </q-input>

          <q-select
            v-if="hasSizes"
            filled dark color="secondary" emit-value map-options
            v-model="selectedSize"
            :options="sizeOptions"
            label="Größe auswählen"
            class="custom-input full-width"
            popup-content-class="premium-dropdown-menu"
          />

          <q-select
            v-if="selectedItem.hasSaucen"
            filled dark color="secondary"
            v-model="selectedSauce"
            :options="filteredSaucen"
            label="Sauce auswählen"
            option-label="name"
            option-value="id"
            map-options
            emit-value
            class="custom-input full-width"
            popup-content-class="premium-dropdown-menu"
          >
            <template v-slot:selected-item="scope">
              <q-chip v-if="scope.opt" dense color="secondary" outline text-color="secondary">
                {{ scope.opt.name || scope.opt }}
              </q-chip>
            </template>
          </q-select>

          <q-select
            v-if="selectedItem?.hasBeilagen"
            filled dark multiple use-chips emit-value map-options
            v-model="selectedBeilagen"
            :options="beilagenOptions"
            label="Beilagen auswählen"
            color="secondary" 
            class="custom-input full-width"
            popup-content-class="premium-dropdown-menu"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                removable dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="secondary" outline text-color="secondary"
                class="q-ma-xs"
              >
                {{ scope.opt.label || scope.opt }}
              </q-chip>
            </template>
          </q-select>

          <q-input
            filled dark color="secondary" label-color="secondary" stack-label
            v-model="anmerkung"
            label="Anmerkung / Wünsche"
            type="textarea" rows="2"
            class="custom-input full-width"
          />

          <div class="q-gutter-y-sm">
            <q-expansion-item class="item-glass-card text-grey-4 overflow-hidden full-width" label="Allergene" icon="info" dense dark>
              <q-card class="bg-transparent">
                <q-card-section class="row wrap q-gutter-xs">
                  <q-chip  v-for="allergen in filteredAllergene" :key="allergen.id" dense size="md" outline color="secondary">
                    <span class="text-white">{{ allergen.name }}</span>
                  </q-chip>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item class="item-glass-card text-grey-4 overflow-hidden full-width" label="Zusatzstoffe" icon="list" dense dark>
              <q-card class="bg-transparent">
                <q-card-section class="row wrap q-gutter-xs">
                  <q-chip v-for="zusatzstoff in filteredZusatzstoffe" :key="zusatzstoff.id" dense size="md" outline color="secondary">
                    <span class="text-white">{{ zusatzstoff.name }}</span>
                  </q-chip>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-list>
      </q-card-section>

      <q-separator dark class="opacity-2" />
      <q-card-actions class="q-pa-md column q-gutter-y-sm dialog-footer">
        <q-btn
          color="secondary" :text-color="schriftFarbe ? 'white' : 'black'"
          class="full-width premium-btn"
          label="In den Warenkorb"
          icon="shopping_cart_checkout"
          @click="addToCart"
        />
        <q-btn flat class="full-width text-grey-6 q-mb-xs" label="Abbrechen" @click="closeDialog" no-caps />
      </q-card-actions>
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
  selectedSauce.value = "";
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
  await loadSchriftFarbe();
});
</script>
<style>
.premium-dropdown-menu {
  border-radius: 16px !important;
  background: rgba(30, 30, 30, 0.98) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white !important;
}
</style>

<style scoped>
.premium-glass-card {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.item-glass-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.item-image { width: 60px; height: 60px; border-radius: 12px; }

.custom-input :deep(.q-field__control) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  min-height: 56px;
}

.premium-btn {
  border-radius: 16px;
  font-weight: 900;
  height: 54px;
}

.dialog-footer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: rgba(18, 18, 18, 0.98);
}

.quantity-controls { display: flex; flex-direction: column; justify-content: center; }
.tracking-widest { letter-spacing: 0.15em; }
.opacity-2 { opacity: 0.2; }
.wrap { flex-wrap: wrap !important; }
</style>