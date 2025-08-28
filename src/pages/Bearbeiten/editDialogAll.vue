<template>
  <q-dialog v-model="editDialog" persistent>
    <q-card style="min-width: 350px; width: 1000px">
      <q-card-section>
        <div class="text-h6">{{ dialogTitle }} bearbeiten</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="updateItem" class="q-gutter-md">
          <div class="relative-position">
            <q-input
              filled
              v-model="editItem.name"
              label="Name"
              :rules="[(val) => !!val || 'Name ist erforderlich']"
              ref="inputRef"
            >
              <template v-slot:append>
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  class="row"
                >
                  <q-item-label caption>Status Neu:</q-item-label>
                  <q-toggle
                    checked-icon="check"
                    color="positive"
                    v-model="editItem.neu"
                  />
                </div>
              </template>
            </q-input>

            <q-chip
              v-if="editItem.neu === true && editItem.name"
              label="Neu"
              color="info"
              clickable
              @click.stop
              :style="chipStyle"
              class="floating-chip"
            />
          </div>

          <div>
            <q-file
              filled
              v-model="selectedEditFile"
              label="Neues Bild hochladen"
              accept="image/*"
              @update:model-value="onEditFileSelected"
              hint="Wähle ein neues Bild oder behalte das aktuelle"
            >
              <template v-slot:prepend>
                <q-icon name="file_upload" />
              </template>
            </q-file>

            <div v-if="uploadStatus !== 'idle'" class="q-mt-sm">
              <q-linear-progress
                v-if="uploadStatus === 'uploading'"
                indeterminate
                color="positive"
                class="q-mt-xs"
              />
              <div
                v-if="uploadStatus === 'success'"
                class="text-green text-caption"
              >
                <q-icon name="check_circle" /> Neues Bild erfolgreich
                hochgeladen
              </div>
              <div
                v-if="uploadStatus === 'error'"
                class="text-red text-caption"
              >
                <q-icon name="error" /> Fehler beim Hochladen
              </div>
            </div>

            <div v-if="editImagePreview" class="q-mt-sm">
              <div class="text-caption q-mb-xs">Neues Bild - Vorschau:</div>
              <q-img
                :src="editImagePreview"
                style="height: 100px; max-width: 100px"
                class="rounded-borders"
              />
              <div
                v-if="uploadStatus === 'success'"
                class="text-green text-caption q-mt-xs"
              >
                <q-icon name="check_circle" /> Neues Bild wird verwendet
              </div>
            </div>

            <div v-else-if="editItem.img && !editImagePreview" class="q-mt-sm">
              <div class="text-caption q-mb-xs">Aktuelles Bild:</div>
              <div style="display: flex; justify-content: center">
                <q-card
                  style="
                    display: flex;
                    justify-content: center;
                    height: 101px;
                    width: 101px;
                  "
                >
                  <q-img
                    :src="getFullImageUrl(editItem.img)"
                    style="height: 100px; max-width: 100px"
                    class="rounded-borders"
                  />
                </q-card>
              </div>
            </div>
          </div>

          <q-input
            filled
            v-model="editItem.description"
            label="Beschreibung"
            type="textarea"
            :rules="[(val) => !!val || 'Beschreibung ist erforderlich']"
          />

          <div v-if="hasSizes === true" class="text-subtitle2 q-mt-md">
            Preise:
          </div>

          <q-toggle
            class="text-caption text-grey-8"
            v-model="editItem.hasSizes"
            left-label
            label="verschiedene Größen"
            color="positive"
            @update:model-value="onHasSizesToggle"
          />

          <q-input
            prefix="€"
            v-if="editItem.hasSizes"
            :key="sizeKleinOn ? 1 : 0"
            :readonly="!sizeKleinOn"
            filled
            v-model="kleinPrice"
            label="Klein:"
            type="text"
            step="0.01"
            min="0.00"
            :rules="[
              (val) =>
                parseFloat(val) > 0 || 'Preis für Klein ist erforderlich',
            ]"
            @focus="handleFocus('klein')"
            @blur="handleBlur('klein')"
            @update:model-value="updateStandardPrice"
          >
            <template v-slot:append>
              <q-checkbox v-model="sizeKleinOn" />
            </template>
          </q-input>

          <q-input
            prefix="€"
            v-if="editItem.hasSizes"
            :key="sizeMittelOn ? 1 : 0"
            :readonly="!sizeMittelOn"
            filled
            v-model="mittelPrice"
            label="Mittel:"
            type="text"
            step="0.01"
            min="0"
            :rules="[
              (val) =>
                parseFloat(val) > 0 || 'Preis für Mittel ist erforderlich',
            ]"
            @focus="handleFocus('mittel')"
            @blur="handleBlur('mittel')"
          >
            <template v-slot:append>
              <q-checkbox v-model="sizeMittelOn" />
            </template>
          </q-input>

          <q-input
            prefix="€"
            v-if="editItem.hasSizes"
            :key="sizeGrossOn ? 1 : 0"
            :readonly="!sizeGrossOn"
            filled
            v-model="großPrice"
            label="Groß:"
            type="text"
            step="0.01"
            min="0"
            :rules="[
              (val) => parseFloat(val) > 0 || 'Preis für Groß ist erforderlich',
            ]"
            @focus="handleFocus('groß')"
            @blur="handleBlur('groß')"
          >
            <template v-slot:append>
              <q-checkbox v-model="sizeGrossOn" />
            </template>
          </q-input>

          <q-input
            prefix="€"
            v-if="editItem.hasSizes"
            :key="sizeFamilieOn ? 1 : 0"
            :readonly="!sizeFamilieOn"
            filled
            v-model="familiePrice"
            label="Familie:"
            type="text"
            step="0.01"
            min="0"
            :rules="[
              (val) => parseFloat(val) > 0 || 'Preis für Groß ist erforderlich',
            ]"
            @focus="handleFocus('familie')"
            @blur="handleBlur('familie')"
          >
            <template v-slot:append>
              <q-checkbox v-model="sizeFamilieOn" />
            </template>
          </q-input>

          <q-input
            prefix="€"
            v-if="!editItem.hasSizes"
            filled
            v-model="singlePrice"
            label="Preis (€)"
            type="text"
            step="0.01"
            min="0"
            :rules="[(val) => parseFloat(val) > 0 || 'Preis ist erforderlich']"
            @focus="handleSinglePriceFocus"
            @blur="handleSinglePriceBlur"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Abbrechen"
          @click="closeEditDialog"
          color="negative"
        />
        <q-btn
          label="Speichern"
          @click="updateItem"
          :loading="isUpdating"
          :disable="uploadStatus === 'uploading'"
          color="secondary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, reactive, ref, watch } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api from "src/boot/axios";
const { logAudit, getCurrentUsername } = useAuditLogger();

const $q = useQuasar();
const editImagePreview = ref("");
const selectedEditFile = ref<File | null>(null);
const isUpdating = ref(false);
const uploadStatus = ref<"idle" | "uploading" | "success" | "error">("idle");
const originalImageUrl = ref("");
const newUploadedImageUrl = ref("");

const kleinPrice = ref("");
const mittelPrice = ref("");
const großPrice = ref("");
const singlePrice = ref("");
const familiePrice = ref("");

const chipStyle = computed(() => {
  if (!editItem.name) return { display: "none" };
  const textWidth = editItem.name.length * 6.6;
  const leftPosition = Math.min(textWidth + 20, 300);

  return {
    position: "absolute",
    left: `${leftPosition}px`,
    top: "41%",
    transform: "translateY(-50%)",
    zIndex: "10",
    pointerEvents: "auto",
  };
});

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
interface ItemSizes {
  sizeName: string;
  price: number;
  categoryItemId: number;
}

interface MenuItem {
  id: number;
  name: string;
  img: string;
  description: string;
  price: number;
  categoryId: number;
  hasSizes: boolean;
  sizes?: ItemSizes[];
  sortOrder: number;
  neu: boolean;
}

const props = defineProps<{
  modelValue: boolean;
  item: MenuItem | null;
  dialogTitle: string;
  apiEndpoint: string;
  imageUrlHint: string;
  hasSizes: boolean | undefined;
  uploadEndpoint?: string;
  categoryId?: number | undefined;
  sizes?: ItemSizes[] | undefined;
  sortOrder?: number | undefined;
  neu?: boolean | undefined;
}>();

const activeSizesCount = computed(() => {
  let count = 0;
  if (sizeKleinOn.value) count++;
  if (sizeMittelOn.value) count++;
  if (sizeGrossOn.value) count++;
  if (sizeFamilieOn.value) count++;
  return count;
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "item-edited": [];
}>();

const editDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const editItem = reactive({
  id: null as number | null,
  name: "",
  img: "",
  description: "",
  price: 0,
  sizes: [] as ItemSizes[],
  categoryId: props.categoryId,
  sortOrder: props.sortOrder,
  neu: props.neu,
  hasSizes: props.hasSizes,
});

const sizeKleinOn = ref(true);
const sizeMittelOn = ref(true);
const sizeGrossOn = ref(true);
const sizeFamilieOn = ref(true);

const onHasSizesToggle = (value: boolean) => {
  editItem.hasSizes = value;

  if (!value) {
    const kleinValue = parseFloat(kleinPrice.value) || editItem.price || 0;
    singlePrice.value = kleinValue.toFixed(2);
    editItem.price = kleinValue;

    kleinPrice.value = "0.00";
    mittelPrice.value = "0.00";
    großPrice.value = "0.00";
    familiePrice.value = "0.00";
    editItem.sizes = [];
  } else {
    if (activeSizesCount.value < 2) {
      editItem.hasSizes = false;
      $q.notify({
        type: "warning",
        position: "top",
        message:
          "Mindestens zwei Größen müssen ausgewählt sein. Verwende Einzelpreis.",
      });
      return;
    }

    const currentPrice = parseFloat(singlePrice.value) || editItem.price || 0;

    kleinPrice.value = currentPrice.toFixed(2);
    mittelPrice.value = "0.00";
    großPrice.value = "0.00";
    familiePrice.value = "0.00";

    editItem.sizes = [
      {
        sizeName: "klein",
        price: currentPrice,
        categoryItemId: editItem.id || 0,
      },
      {
        sizeName: "mittel",
        price: 0,
        categoryItemId: editItem.id || 0,
      },
      { sizeName: "groß", price: 0, categoryItemId: editItem.id || 0 },
      { sizeName: "familie", price: 0, categoryItemId: editItem.id || 0 },
    ];

    editItem.price = currentPrice;
    singlePrice.value = "0.00";
  }
};
const updateStandardPrice = () => {
  const kleinValue = parseFloat(kleinPrice.value) || 0;
  editItem.price = kleinValue;

  const kleinSize = editItem.sizes.find((size) => size.sizeName === "klein");
  if (kleinSize) {
    kleinSize.price = kleinValue;
  }
};

const handleFocus = (size: "klein" | "mittel" | "groß" | "familie") => {
  const currentRef =
    size === "klein"
      ? kleinPrice
      : size === "mittel"
        ? mittelPrice
        : size === "groß"
          ? großPrice
          : familiePrice;
  if (currentRef.value === "0" || currentRef.value === "0.00") {
    currentRef.value = "";
  }
};

const handleBlur = (size: "klein" | "mittel" | "groß" | "familie") => {
  const currentRef =
    size === "klein"
      ? kleinPrice
      : size === "mittel"
        ? mittelPrice
        : size === "groß"
          ? großPrice
          : familiePrice;
  const rawValue = (currentRef.value || "").toString().replace(",", ".");
  const value = parseFloat(rawValue);

  if (props.hasSizes) {
    const sizeObj = editItem.sizes.find((s) => s.sizeName === size);
    if (sizeObj) {
      sizeObj.price = value;
    }

    if (size === "klein") {
      editItem.price = value;
    }
  }

  if (!isNaN(value)) {
    currentRef.value = value.toFixed(2);
  } else {
    currentRef.value = "0.00";
  }
};

const handleSinglePriceFocus = () => {
  if (singlePrice.value === "0" || singlePrice.value === "0.00") {
    singlePrice.value = "";
  }
};

const handleSinglePriceBlur = () => {
  const rawValue = (singlePrice.value || "").toString().replace(",", ".");
  const value = parseFloat(rawValue);

  if (!isNaN(value)) {
    singlePrice.value = value.toFixed(2);
    editItem.price = value;
  } else {
    singlePrice.value = "0.00";
    editItem.price = 0;
  }
};

const uploadImage = async (
  file: File,
  customUploadPath?: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file, file.name);

  const uploadPath = customUploadPath || "api/uploads/images";

  try {
    let response;

    if (uploadPath.startsWith("http://") || uploadPath.startsWith("https://")) {
      response = await api.post(uploadPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        baseURL: "",
      });
    } else {
      response = await api.post(uploadPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    const result = response.data;

    return result.imageUrl || result.url || result.path;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

const deleteOldImage = async (imageUrl: string) => {
  if (!imageUrl) return;

  try {
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    const endpoint = `api/uploads/images/${filename}`;

    await api.delete(endpoint);
  } catch (error) {
    console.warn("Fehler beim Löschen des alten Bildes:", error);
  }
};

const onEditFileSelected = async (file: File | null) => {
  if (file) {
    selectedEditFile.value = file;
    uploadStatus.value = "idle";

    const reader = new FileReader();
    reader.onload = (e) => {
      editImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    try {
      uploadStatus.value = "uploading";

      const uploadedImageUrl = await uploadImage(file);

      newUploadedImageUrl.value = uploadedImageUrl;
      uploadStatus.value = "success";

      $q.notify({
        type: "positive",
        position: "top",
        message: "Neues Bild erfolgreich hochgeladen!",
      });
    } catch {
      uploadStatus.value = "error";
      editImagePreview.value = "";
      newUploadedImageUrl.value = "";

      $q.notify({
        type: "negative",
        position: "top",
        message: "Fehler beim Hochladen des neuen Bildes",
      });
    }
  } else {
    selectedEditFile.value = null;
    editImagePreview.value = "";
    uploadStatus.value = "idle";
    newUploadedImageUrl.value = "";

    if (originalImageUrl.value) {
      editItem.img = originalImageUrl.value;
    }
  }
};

const closeEditDialog = async () => {
  if (newUploadedImageUrl.value) {
    await deleteOldImage(newUploadedImageUrl.value);
  }

  uploadStatus.value = "idle";
  editImagePreview.value = "";
  selectedEditFile.value = null;
  originalImageUrl.value = "";
  newUploadedImageUrl.value = "";

  emit("update:modelValue", false);
};

const updateItem = async () => {
  if (!props.item) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Das zu bearbeitende Item konnte nicht geladen werden.",
    });
    return;
  }

  const oldItem = props.item;

  if (uploadStatus.value === "uploading") {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Bitte warten Sie bis das Bild vollständig hochgeladen ist",
    });
    return;
  }

  if (newUploadedImageUrl.value) {
    editItem.img = newUploadedImageUrl.value;
  }

  if (editItem.hasSizes) {
    const kleinValue = sizeKleinOn.value
      ? parseFloat((kleinPrice.value || "").toString().replace(",", ".")) || 0
      : 0;
    const mittelValue = sizeMittelOn.value
      ? parseFloat((mittelPrice.value || "").toString().replace(",", ".")) || 0
      : 0;
    const großValue = sizeGrossOn.value
      ? parseFloat((großPrice.value || "").toString().replace(",", ".")) || 0
      : 0;
    const familieValue = sizeFamilieOn.value
      ? parseFloat((familiePrice.value || "").toString().replace(",", ".")) || 0
      : 0;

    const updatedSizes = [];
    if (sizeKleinOn.value)
      updatedSizes.push({
        sizeName: "Klein",
        price: kleinValue,
        categoryItemId: editItem.id || 0,
      });
    if (sizeMittelOn.value)
      updatedSizes.push({
        sizeName: "Mittel",
        price: mittelValue,
        categoryItemId: editItem.id || 0,
      });
    if (sizeGrossOn.value)
      updatedSizes.push({
        sizeName: "Groß",
        price: großValue,
        categoryItemId: editItem.id || 0,
      });
    if (sizeFamilieOn.value)
      updatedSizes.push({
        sizeName: "Familie",
        price: familieValue,
        categoryItemId: editItem.id || 0,
      });

    editItem.sizes = updatedSizes;

    editItem.price = kleinValue || mittelValue || großValue || familieValue;

    const activeInvalidPrices = [
      sizeKleinOn.value && kleinValue <= 0,
      sizeMittelOn.value && mittelValue <= 0,
      sizeGrossOn.value && großValue <= 0,
      sizeFamilieOn.value && familieValue <= 0,
    ].some(Boolean);

    if (
      !editItem.name ||
      !editItem.img ||
      !editItem.description ||
      activeInvalidPrices
    ) {
      $q.notify({
        type: "negative",
        position: "top",
        message:
          "Bitte füllen Sie alle Felder korrekt aus und stellen Sie sicher, dass alle aktivierten Preise größer als 0 sind",
      });
      return;
    }
  } else {
    const singleValue =
      parseFloat((singlePrice.value || "").toString().replace(",", ".")) || 0;
    editItem.price = singleValue;
    editItem.sizes = [];
    if (
      !editItem.name ||
      !editItem.img ||
      !editItem.description ||
      singleValue <= 0
    ) {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Bitte füllen Sie alle Felder korrekt aus",
      });
      return;
    }
  }

  isUpdating.value = true;
  try {
    const requestBody = {
      id: editItem.id,
      name: editItem.name,
      img: editItem.img,
      description: editItem.description,
      price: editItem.price,
      categoryId: editItem.categoryId || props.categoryId,
      hasSizes: editItem.hasSizes,
      ...(editItem.hasSizes ? { sizes: editItem.sizes } : { sizes: [] }),
      sortOrder: editItem.sortOrder,
      neu: editItem.neu,
    };

    const response = await api.put(
      `api/categoryitems/${editItem.id}`,
      requestBody
    );

    const categoryName = await getCategoryNameById(props.categoryId!);
    const currentUser = getCurrentUsername();

    await logAudit("update", "categoryItem", editItem.id!, {
      oldValues: {
        name: oldItem.name,
        description: oldItem.description,
        price: oldItem.price,
        img: oldItem.img,
        sortOrder: oldItem.sortOrder,
        neu: oldItem.neu,
        hasSizes: oldItem.hasSizes,
      },
      newValues: {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        img: editItem.img,
        sortOrder: editItem.sortOrder,
        neu: editItem.neu,
        hasSizes: editItem.hasSizes,
      },
      message: `Item "${oldItem.name}" wurde in der Kategorie "${categoryName}" aktualisiert`,
      username: currentUser,
    });

    if (response.data) {
      console.log("API Response Data:", JSON.stringify(response.data, null, 2));
    }

    if (
      newUploadedImageUrl.value &&
      originalImageUrl.value &&
      originalImageUrl.value !== newUploadedImageUrl.value
    ) {
      await deleteOldImage(originalImageUrl.value);
    }

    $q.notify({
      type: "positive",
      position: "top",
      message: `${props.dialogTitle} wurde erfolgreich aktualisiert!`,
    });

    originalImageUrl.value = "";
    newUploadedImageUrl.value = "";
    uploadStatus.value = "idle";
    editImagePreview.value = "";
    selectedEditFile.value = null;

    emit("update:modelValue", false);
    emit("item-edited");
  } catch (error) {
    console.error(`Error updating ${props.dialogTitle}:`, error);
    $q.notify({
      type: "negative",
      position: "top",
      message: `Fehler beim Aktualisieren des ${props.dialogTitle}`,
    });
  } finally {
    isUpdating.value = false;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.item) {
      uploadStatus.value = "idle";
      editImagePreview.value = "";
      selectedEditFile.value = null;
      newUploadedImageUrl.value = "";

      originalImageUrl.value = props.item.img;

      editItem.id = props.item.id;
      editItem.name = props.item.name;
      editItem.img = props.item.img;
      editItem.description = props.item.description;
      editItem.price = props.item.price;
      editItem.sortOrder = props.item.sortOrder;
      editItem.neu = props.item.neu;
      editItem.hasSizes = props.item.hasSizes;

      if (props.hasSizes && props.sizes && props.sizes.length > 0) {
        editItem.sizes = [...props.sizes];

        const kleinSize = props.sizes.find((s) => s.sizeName === "Klein");
        const mittelSize = props.sizes.find((s) => s.sizeName === "Mittel");
        const großSize = props.sizes.find((s) => s.sizeName === "Groß");
        const familieSize = props.sizes.find((s) => s.sizeName === "Familie");

        kleinPrice.value = kleinSize ? kleinSize.price.toFixed(2) : "0.00";
        mittelPrice.value = mittelSize ? mittelSize.price.toFixed(2) : "0.00";
        großPrice.value = großSize ? großSize.price.toFixed(2) : "0.00";
        familiePrice.value = familieSize
          ? familieSize.price.toFixed(2)
          : "0.00";

        sizeKleinOn.value = parseFloat(kleinPrice.value) > 0;
        sizeMittelOn.value = parseFloat(mittelPrice.value) > 0;
        sizeGrossOn.value = parseFloat(großPrice.value) > 0;
        sizeFamilieOn.value = parseFloat(familiePrice.value) > 0;

        editItem.price = kleinSize ? kleinSize.price : props.item.price;
      } else {
        editItem.sizes = [];
        singlePrice.value = props.item.price.toFixed(2);
      }
    }
  },
  { immediate: true }
);

watch(
  [kleinPrice, mittelPrice, großPrice, familiePrice],
  ([klein, mittel, groß, familie]) => {
    if (props.hasSizes == true) {
      const kleinValue = parseFloat(klein) || 0;
      const mittelValue = parseFloat(mittel) || 0;
      const großValue = parseFloat(groß) || 0;
      const familieValue = parseFloat(familie) || 0;

      const kleinSize = editItem.sizes.find((s) => s.sizeName === "klein");
      const mittelSize = editItem.sizes.find((s) => s.sizeName === "mittel");
      const großSize = editItem.sizes.find((s) => s.sizeName === "groß");
      const familieSize = editItem.sizes.find((s) => s.sizeName === "familie");

      if (kleinSize) kleinSize.price = kleinValue;
      if (mittelSize) mittelSize.price = mittelValue;
      if (großSize) großSize.price = großValue;
      if (familieSize) familieSize.price = familieValue;

      editItem.price = kleinValue;
    }
  }
);

watch(singlePrice, (newPrice) => {
  if (!props.hasSizes) {
    editItem.price = parseFloat(newPrice) || 0;
  }
});

const getCategoryNameById = async (categoryId: number): Promise<string> => {
  try {
    const response = await api.get(`api/category/${categoryId}`);
    return response.data.name;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorie:", error);
    return "Unbekannte Kategorie";
  }
};
</script>

<style scoped>
.floating-chip {
  transition: left 0.2s ease;
}

.relative-position {
  position: relative;
}
</style>
