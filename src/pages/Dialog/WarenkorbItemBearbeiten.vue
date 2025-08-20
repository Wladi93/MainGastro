<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card
      class="fenster flex items-center full-width"
      style="justify-content: center"
    >
      <q-card-section class="section q-gutter-y-xs full-width">
        <h6 class="name text-h6">Artikel bearbeiten</h6>

        <div v-if="selectedItem" class="item-info q-mb-md">
          <div class="item-display">
            <q-img
              :src="getFullImageUrl(selectedItem.img)"
              class="item-image"
              :alt="selectedItem.name"
            />
            <div class="item-details">
              <p class="text-subtitle1 q-mb-xs">{{ selectedItem.name }}</p>
              <p class="text-caption text-grey-7">
                {{ selectedItem.description }}
              </p>
            </div>
          </div>
        </div>
        <q-input
          filled
          type="textarea"
          clearable
          class="q-mb-md"
          hint="Anmerkung"
          :model-value="String(selectedItem?.anmerkung ?? '')"
          @update:model-value="
            (val: string | number | null) =>
              selectedItem && (selectedItem!.anmerkung = String(val ?? ''))
          "
        />

        <q-select
          v-if="selectedItem?.hasSizes && availableSizes.length > 0"
          v-model="newSize"
          :options="availableSizes"
          label="Größe auswählen"
          filled
          class="select q-gutter-y-xs"
          option-label="sizeName"
          option-value="sizeName"
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

        <q-input
          class="input q-gutter-y-xs"
          v-model.number="newQuantity"
          label="Anzahl"
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
                icon="remove"
                size="sm"
                @click="decreaseQuantity"
                :disable="newQuantity <= 1"
              />
              <q-btn
                flat
                dense
                icon="add"
                size="sm"
                @click="increaseQuantity"
                :disable="newQuantity >= 99"
              />
            </div>
          </template>
        </q-input>

        <div v-if="selectedItem" class="price-preview q-mt-md">
          <div class="price-breakdown">
            <div class="price-row">
              <span>Einzelpreis:</span>
              <span class="price">{{ getCurrentPrice().toFixed(2) }}€</span>
            </div>
            <div class="price-row">
              <span>Anzahl:</span>
              <span>{{ newQuantity }}</span>
            </div>
            <q-separator class="q-my-xs" />
            <div class="price-row total-price">
              <span><strong>Gesamtpreis:</strong></span>
              <span class="price"
                ><strong
                  >{{ (getCurrentPrice() * newQuantity).toFixed(2) }}€</strong
                ></span
              >
            </div>
          </div>
        </div>
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
            flat
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
import type { GenericCartItem, ItemSizes } from "src/store/cardStore";
import { useCartStore } from "src/store/cardStore";
import { useQuasar } from "quasar";

const isOpen = defineModel<boolean>("isOpen", { required: true });
const selectedItem = defineModel<GenericCartItem | null>("selectedItem", {
  required: true,
});

const $q = useQuasar();
const cartStore = useCartStore();

const newSize = ref<string>("");
const newQuantity = ref(1);
const availableSizes = ref<ItemSizes[]>([]);
const loadingSizes = ref(false);
const saving = ref(false);

function closeDialog() {
  isOpen.value = false;
}
const BASE_URL = "http://localhost:5008/";

const isValid = computed(() => {
  return newQuantity.value > 0 && newQuantity.value <= 99;
});

const getFullImageUrl = (imgUrl: string): string => {
  if (!imgUrl) return "";
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  return BASE_URL + imgUrl;
};

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

const fetchItemSizes = async () => {
  if (!selectedItem.value?.hasSizes || !selectedItem.value.id) return;

  loadingSizes.value = true;
  try {
    const response = await fetch(
      `http://localhost:5008/api/categoryItems/${selectedItem.value.id}/sizes`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const sizes = await response.json();
    availableSizes.value = sizes;
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

  saving.value = true;
  try {
    cartStore.updateGenericCartItem(
      selectedItem.value.id,
      selectedItem.value.categoryName,
      newQuantity.value,
      newSize.value || selectedItem.value.selectedSize
    );

    $q.notify({
      message: "Artikel wurde erfolgreich bearbeitet",
      icon: "check_circle",
      color: "positive",
      timeout: 2000,
    });

    closeDialog();
  } catch (error) {
    console.error("Error saving changes:", error);
    $q.notify({
      type: "negative",
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
  border-radius: 8px;
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

.price-row.total-price {
  font-size: 1.1em;
  color: #1976d2;
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
