<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="full-width" style="justify-content: center">
      <q-card-section class="full-width">
        <q-item-label caption class="text-center"
          >Artikel bearbeiten</q-item-label
        >

        <q-separator inset class="q-mb-md q-mt-sm" />

        <q-card v-if="selectedItem" class="q-mb-md q-pa-sm row flex">
          <q-img
            :src="getFullImageUrl(selectedItem.img)"
            class="q-mr-md"
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
          />
          <div class="item-details">
            <p class="text-subtitle1 q-mb-xs">
              {{ selectedItem.name }}
            </p>
            <p class="text-caption text-grey-7">
              {{ selectedItem.description }}
            </p>
          </div>
        </q-card>
        <q-input
          v-model.number="newQuantity"
          label="Anzahl"
          label-color="secondary"
          type="number"
          min="1"
          max="99"
          filled
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
                :disable="newQuantity >= 99"
              />
              <q-btn
                flat
                dense
                icon="remove"
                size="sm"
                @click="decreaseQuantity"
                :disable="newQuantity <= 1"
              />
            </div>
          </template>
        </q-input>

        <q-select
          v-if="selectedItem?.hasSizes"
          v-model="newSize"
          :options="sizeOptions"
          label="Größe auswählen"
          filled
          class="q-mb-md"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          :loading="loadingSizes"
          :disable="loadingSizes"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.sizeName }}</q-item-label>
                <q-item-label caption
                  >{{ scope.opt.price.toFixed(2) }}€</q-item-label
                >
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-if="selectedItem?.hasBeilagen"
          class="q-mb-md"
          filled
          v-model="selectedItem.beilagen"
          :options="beilagenOptions"
          label="Beilagen auswählen"
          color="accent"
          option-label="label"
          option-value="value"
          multiple
          use-chips
          emit-value
          map-options
          :key="selectedItem.selectedSize || 'no-size'"
        />

        <q-input
          filled
          type="textarea"
          clearable
          class="q-mb-md"
          label="Anmerkung"
          label-color="secondary"
          stack-label
          placeholder="hier kann eine Nachricht bzgl. der Bestellung hinterlassen werden..."
          :model-value="String(selectedItem?.anmerkung ?? '')"
          @update:model-value="
            (val: string | number | null) =>
              selectedItem && (selectedItem!.anmerkung = String(val ?? ''))
          "
        />

        <q-item-section
          style="
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
          "
          v-if="selectedItem"
          class="q-mt-md full-width"
        >
          <div class="price-breakdown">
            <div class="price-row">
              <q-item-label caption>Einzelpreis:</q-item-label>
              <q-item-label caption class="text-black"
                >{{ getCurrentPrice().toFixed(2) }}€</q-item-label
              >
            </div>
            <div
              v-for="(beilage, index) in selectedItem.beilagen"
              :key="index"
              class="price-row"
            >
              <q-item-label caption>{{ beilage }}:</q-item-label>
              <q-item-label caption
                >+ {{ selectedItem.beilagenPreis?.toFixed(2) }}€</q-item-label
              >
            </div>
            <div class="price-row">
              <q-item-label caption>Anzahl:</q-item-label>
              <q-item-label caption class="text-black">{{
                newQuantity
              }}</q-item-label>
            </div>
            <q-separator class="q-my-xs" />
            <div class="price-row text-accent">
              <q-item-label>Gesamtsumme:</q-item-label>
              <q-item-label>
                {{
                  (itemPreis(selectedItem) * newQuantity).toFixed(2)
                }}€</q-item-label
              >
            </div>
          </div>
        </q-item-section>
      </q-card-section>

      <q-card-actions
        class="full-width"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div
          class="row"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
          "
        >
          <q-btn
            @click="closeDialog"
            label="Abbrechen"
            color="negative"
            flat
            icon="close"
          />
          <q-btn
            @click="saveChanges"
            label="Änderung speichern"
            color="secondary"
            unelevated
            icon="save"
            :loading="saving"
            :disable="!isValid"
          />
        </div>
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

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 500px;
}

.btnPosition {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  justify-content: space-between;
}

.fenster {
  min-width: 450px;
  max-width: 550px;
  background-color: white;
  border-radius: 8px;
}

.item-info {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.item-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.price-preview {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  text-align: center;
  margin-bottom: 16px;
  color: #1976d2;
}

@media (max-width: 600px) {
  .section {
    min-width: 300px;
    max-width: 350px;
  }

  .fenster {
    min-width: 320px;
    max-width: 380px;
  }

  .name {
    font-size: 1.1rem;
  }

  .btnPosition {
    flex-direction: column;
    gap: 8px;
  }

  .item-display {
    flex-direction: column;
    text-align: center;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }
}

@media (min-width: 601px) {
  .section {
    min-width: 450px;
    max-width: 500px;
  }

  .fenster {
    min-width: 500px;
    max-width: 550px;
  }
}
</style>
