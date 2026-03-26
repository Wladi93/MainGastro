<template>
  <q-dialog v-model="isOpen" backdrop-filter="blur(10px)" persistent>
    <q-card class="premium-glass-card shadow-24 flex column no-wrap" style="min-width: 90vw; max-height: 85vh; border-radius: 28px;">
      
      <q-card-section class="text-center q-pb-none">
        <q-item-label class="text-overline text-secondary text-weight-bold tracking-widest">
          Artikel bearbeiten
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
                <q-item-label class="text-white text-weight-bold text-subtitle1">
                  {{ selectedItem.name }}
                </q-item-label>
                <q-item-label caption class="text-grey-4 clamp-text">
                  {{ selectedItem.description }}
                </q-item-label>
              </q-item-section>
            </q-card>
          </q-item>

          <q-input
            filled dark color="secondary" label-color="secondary" stack-label
            v-model.number="newQuantity"
            label="Anzahl"
            type="number"
            class="custom-input full-width"
          >
            <template v-slot:append>
              <div class="quantity-controls">
                <q-btn flat dense icon="add" size="sm" color="secondary" @click="increaseQuantity" :disable="newQuantity >= 99" />
                <q-btn flat dense icon="remove" size="sm" color="secondary" @click="decreaseQuantity" :disable="newQuantity <= 1" />
              </div>
            </template>
          </q-input>

          <q-select
            v-if="selectedItem?.hasSizes"
            filled dark color="secondary" emit-value map-options
            v-model="newSize"
            :options="sizeOptions"
            label="Größe auswählen"
            :loading="loadingSizes"
            class="custom-input full-width"
            popup-content-class="premium-dropdown-menu"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.sizeName }}</q-item-label>
                  <q-item-label caption class="text-secondary">{{ scope.opt.price.toFixed(2) }}€</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-if="selectedItem?.hasBeilagen"
            filled dark multiple use-chips emit-value map-options
            v-model="selectedItem.beilagen"
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
            type="textarea" rows="2"
            label="Anmerkung"
            placeholder="hier Nachricht hinterlassen..."
            class="custom-input full-width"
            :model-value="String(selectedItem?.anmerkung ?? '')"
            @update:model-value="(val) => selectedItem && (selectedItem!.anmerkung = String(val ?? ''))"
          />

          <div class="summary-box q-pa-md full-width">
            <div class="price-breakdown">
              <div class="price-row">
                <span class="text-grey-5">Einzelpreis:</span>
                <span class="text-white">{{ getCurrentPrice().toFixed(2) }}€</span>
              </div>
              <div v-for="(beilage, index) in selectedItem.beilagen" :key="index" class="price-row">
                <span class="text-grey-5">{{ beilage }}:</span>
                <span class="text-secondary">+ {{ selectedItem.beilagenPreis?.toFixed(2) }}€</span>
              </div>
              <div class="price-row">
                <span class="text-grey-5">Anzahl:</span>
                <span class="text-white">{{ newQuantity }}</span>
              </div>
              <q-separator dark class="q-my-sm opacity-2" />
              <div class="price-row text-subtitle1 text-weight-bold">
                <span class="text-secondary">Gesamtsumme:</span>
                <span class="text-secondary">{{ (itemPreis(selectedItem) * newQuantity).toFixed(2) }}€</span>
              </div>
            </div>
          </div>
        </q-list>
      </q-card-section>

      <q-separator dark class="opacity-2" />
      <q-card-actions class="q-pa-md column q-gutter-y-sm dialog-footer">
        <q-btn
          color="secondary" text-color="dark"
          class="full-width premium-btn"
          label="Änderung speichern"
          icon="save"
          :loading="saving"
          :disable="!isValid"
          @click="saveChanges"
        />
        <q-btn flat class="full-width text-grey-6 q-mb-xs" label="Abbrechen" icon="close" @click="closeDialog" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { GenericCartItem } from "src/store/cardStore";
import { useCartStore } from "src/store/cardStore";
import { useQuasar } from "quasar";
import type { ItemSizes } from "../types/CategoryItemsSizes";
import api, { getBaseURL } from "src/boot/axios";
import type { BeilagenName, BeilagenPreise } from "../types/BeilagenType";

const isOpen = defineModel<boolean>("isOpen", { required: true });
const selectedItem = defineModel<GenericCartItem | null>("selectedItem", {
  required: true,
});

const $q = useQuasar();
const cartStore = useCartStore();

const originalSize = ref<string>("");
const originalQuantity = ref(1);
const newSize = ref<string>("");
const newQuantity = ref(1);
const availableSizes = ref<ItemSizes[]>([]);
const loadingSizes = ref(false);
const saving = ref(false);
const beilageName = ref<BeilagenName[]>([]);
const beilagenPreise = ref<BeilagenPreise[]>([]);

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

function closeDialog() {
  isOpen.value = false;
}

const isValid = computed(() => {
  return newQuantity.value > 0 && newQuantity.value <= 99;
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

const beilagenOptions = computed(() => {
  return beilageName.value.map((beilage) => {
    const beilagenPreis =
      beilagenPreise.value.find((preis) => preis.id === beilage.id) ||
      beilagenPreise.value[0];

    let price = 0;
    if (beilagenPreis && newSize.value) {
      const sizeLower = newSize.value.toLowerCase();
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

const getCurrentPrice = (): number => {
  if (!selectedItem.value) return 0;

  if (selectedItem.value.hasSizes && newSize.value) {
    const selectedSizeObj = availableSizes.value.find(
      (size) => size.sizeName === newSize.value
    );
    return selectedSizeObj?.price || selectedItem.value.price;
  }

  return selectedItem.value.price;
};

const increaseQuantity = () => {
  if (newQuantity.value < 99) {
    newQuantity.value++;
  }
};

const decreaseQuantity = () => {
  if (newQuantity.value > 1) {
    newQuantity.value--;
  }
};

const sizeOptions = computed(() => {
  if (!availableSizes.value || availableSizes.value.length === 0) return [];

  return [...availableSizes.value]
    .sort((a, b) => a.price - b.price)
    .map((size) => ({
      label: `${size.sizeName} - ${size.price.toFixed(2)}€`,
      value: size.sizeName,
      sizeName: size.sizeName,
      price: size.price,
    }));
});

const fetchItemSizes = async () => {
  if (!selectedItem.value?.hasSizes || !selectedItem.value.id) return;

  loadingSizes.value = true;
  try {
    const response = await api.get(
      `/api/CategoryItemSizes/by-item/${selectedItem.value.id}`
    );

    availableSizes.value = response.data;
  } catch (error) {
    console.error("Error fetching item sizes:", error);
    $q.notify({
      type: "negative",
      message: "Fehler beim Laden der Größen",
      timeout: 3000,
    });
  } finally {
    loadingSizes.value = false;
  }
};

const saveChanges = () => {
  if (!selectedItem.value || !isValid.value) return;

  if (selectedItem.value.hasSizes && !newSize.value) {
    $q.notify({
      type: "warning",
      position: "top",
      message: "Bitte wählen Sie eine Größe aus",
      timeout: 2000,
    });
    return;
  }

  saving.value = true;
  try {
    const currentPrice = getCurrentPrice();

    cartStore.updateOrReplaceGenericCartItem(
      selectedItem.value.id,
      selectedItem.value.categoryName,
      selectedItem.value.selectedSize,
      newQuantity.value,
      newSize.value,
      selectedItem.value.anmerkung || undefined,
      currentPrice
    );

    $q.notify({
      message: "Artikel wurde erfolgreich bearbeitet",
      position: "top",
      icon: "check_circle",
      color: "positive",
      timeout: 2000,
    });

    closeDialog();
  } catch (error) {
    console.error("Error saving changes:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Speichern der Änderungen",
      timeout: 3000,
    });
  } finally {
    saving.value = false;
  }
};

watch(
  () => selectedItem.value,
  async (newItem) => {
    if (newItem) {
      newQuantity.value = newItem.quantity;
      newSize.value = newItem.selectedSize || "";
      originalSize.value = newItem.selectedSize || "";
      originalQuantity.value = newItem.quantity;

      if (newItem.hasSizes) {
        await fetchItemSizes();
      }
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (selectedItem.value) {
    newQuantity.value = selectedItem.value.quantity;
    newSize.value = selectedItem.value.selectedSize || "";
    originalSize.value = selectedItem.value.selectedSize || "";
    originalQuantity.value = selectedItem.value.quantity;

    if (selectedItem.value.hasSizes) {
      await fetchItemSizes();
    }
  }
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

.item-image { width: 60px; height: 60px; border-radius: 12px; }
.summary-box { background: rgba(255, 255, 255, 0.03); border-radius: 16px; }
.price-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }

.custom-input :deep(.q-field__control) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.premium-btn { border-radius: 16px; font-weight: 900; height: 54px; }
.quantity-controls { display: flex; flex-direction: column; justify-content: center; }
.tracking-widest { letter-spacing: 0.15em; }
.opacity-2 { opacity: 0.2; }
.clamp-text { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* iPhone Safe-Area Fix */
.dialog-footer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: rgba(18, 18, 18, 0.98);
}
</style>