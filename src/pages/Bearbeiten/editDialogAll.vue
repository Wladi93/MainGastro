<template>
  <q-dialog v-model="editDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card class="premium-glass-card custom-dialog-width shadow-24">
      
      <q-card-section>
        <div class="text-center q-mb-xl">
          <div class="text-overline text-secondary text-weight-bold tracking-widest">BEARBEITEN</div>
          <div class="text-h5 text-white text-weight-light uppercase">{{ dialogTitle }}</div>
        </div>

        <q-form @submit="updateItem" class="full-width" style="display:flex; flex-direction:column; gap:16px;">
          
          <div class="relative-position full-width">
            <q-input
              dark filled
              v-model="editItem.name"
              label="Name"
              class="premium-input full-width"
              :rules="[(val: string) => !!val || 'Name ist erforderlich']"
              ref="inputRef"
            >
              <template v-slot:prepend><q-icon name="edit" /></template>
              <template v-slot:append>
                <div class="row items-center no-wrap">
                  <q-item-label caption class="text-grey-5 q-mr-sm">Status Neu:</q-item-label>
                  <q-toggle checked-icon="check" color="secondary" v-model="editItem.neu" keep-color />
                </div>
              </template>
            </q-input>

            <q-chip
              v-if="editItem.neu === true && editItem.name"
              label="Neu"
              color="secondary"
              dense
              :style="chipStyle"
              class="floating-chip"
            />
          </div>

          <div class="premium-glass-card-inner q-pa-md full-width">
            <q-file
              dark filled
              v-model="selectedEditFile"
              label="Neues Bild hochladen"
              accept="image/*"
              class="premium-input full-width"
              @update:model-value="onEditFileSelected"
              hint="Wähle ein neues Bild oder behalte das aktuelle"
            >
              <template v-slot:prepend><q-icon name="file_upload" /></template>
            </q-file>

            <div v-if="uploadStatus !== 'idle'" class="q-mt-sm">
              <q-linear-progress
                v-if="uploadStatus === 'uploading'"
                indeterminate
                color="secondary"
                size="10px"
                rounded
                class="q-mt-md"
              />
              <div v-if="uploadStatus === 'success'" class="text-secondary text-caption q-mt-xs">
                <q-icon name="check_circle" /> Bild bereit
              </div>
              <div v-if="uploadStatus === 'error'" class="text-negative text-caption q-mt-xs">
                <q-icon name="error" /> Fehler beim Hochladen
              </div>
            </div>

            <div class="flex justify-center q-mt-md">
              <div v-if="editImagePreview || editItem.img" class="preview-container shadow-10">
                <q-img :src="editImagePreview || getFullImageUrl(editItem.img)" class="rounded-borders full-height" />
              </div>
            </div>
          </div>

          <q-input
            dark filled
            v-model="editItem.description"
            label="Beschreibung"
            type="textarea"
            class="premium-input full-width"
            :rules="[(val: string) => !!val || 'Beschreibung ist erforderlich']"
          >
            <template v-slot:prepend><q-icon name="description" /></template>
          </q-input>

          <div class="q-gutter-y-sm full-width">
            <div class="option-row">
              <q-toggle dark color="secondary" v-model="editItem.hasSaucen" label="Saucen verfügbar" left-label class="full-width justify-between" />
            </div>
            
            <q-slide-transition>
              <div v-if="editItem.hasSaucen" class="q-pl-md q-pb-md border-left-accent full-width">
                <div v-for="sauce in saucen" :key="sauce.id" class="row items-center q-mb-xs">
                  <q-checkbox dark v-model="editItem.saucenIds" :val="sauce.id" color="secondary" />
                  <span class="text-caption text-grey-4">{{ sauce.name }}</span>
                </div>
              </div>
            </q-slide-transition>

            <div class="option-row">
              <q-toggle dark color="secondary" v-model="editItem.hasBeilagen" label="Beilagen verfügbar" left-label class="full-width justify-between" />
            </div>

            <div class="option-row">
              <q-toggle dark color="secondary" v-model="editItem.hasSizes" label="Verschiedene Größen" left-label class="full-width justify-between" @update:model-value="onHasSizesToggle" />
            </div>
          </div>

          <div class="price-section q-mt-md full-width">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Preiskonfiguration</div>
            
            <div v-if="editItem.hasSizes" class="q-gutter-y-md">
             <q-input dark filled prefix="€" v-model="kleinPrice" label="Klein" class="premium-input full-width" :readonly="!sizeKleinOn" @focus="handleFocus('klein')" @blur="handleBlur('klein')" @update:model-value="updateStandardPrice">
                <template v-slot:append><q-checkbox dark v-model="sizeKleinOn" color="secondary" dense /></template>
              </q-input>
              <q-input dark filled prefix="€" v-model="mittelPrice" label="Mittel" class="premium-input full-width" :readonly="!sizeMittelOn" @focus="handleFocus('mittel')" @blur="handleBlur('mittel')">
                <template v-slot:append><q-checkbox dark v-model="sizeMittelOn" color="secondary" dense /></template>
              </q-input>
              <q-input dark filled prefix="€" v-model="großPrice" label="Groß" class="premium-input full-width" :readonly="!sizeGrossOn" @focus="handleFocus('groß')" @blur="handleBlur('groß')">
                <template v-slot:append><q-checkbox dark v-model="sizeGrossOn" color="secondary" dense /></template>
              </q-input>
              <q-input dark filled prefix="€" v-model="familiePrice" label="Familie" class="premium-input full-width" :readonly="!sizeFamilieOn" @focus="handleFocus('familie')" @blur="handleBlur('familie')">
                <template v-slot:append><q-checkbox dark v-model="sizeFamilieOn" color="secondary" dense /></template>
              </q-input>
            </div>

            <q-input v-else dark filled prefix="€" v-model="singlePrice" label="Einzelpreis" class="premium-input full-width" @focus="handleSinglePriceFocus" @blur="handleSinglePriceBlur" />
          </div>

          <q-expansion-item
            dark
            header-class="premium-expansion-header"
            label="Allergene"
            class="premium-glass-card-inner overflow-hidden full-width"
          >
            <div class="q-pa-md column q-gutter-y-xs">
              <div v-for="a in allergene" :key="a.id">
                <q-checkbox dark dense v-model="editItem.allergeneIds" :val="a.id" :label="a.name" class="text-caption" />
                <q-separator dark class="q-my-md opacity-10" />
              </div>
            </div>
          </q-expansion-item>

          <q-expansion-item
            dark
            header-class="premium-expansion-header"
            label="Zusatzstoffe"
            class="premium-glass-card-inner overflow-hidden full-width"
          >
            <div class="q-pa-md column q-gutter-y-xs">
              <div v-for="z in zusatzstoffe" :key="z.id">
                <q-checkbox dark dense v-model="editItem.zusatzstoffeIds" :val="z.id" :label="z.name" class="text-caption" />
                <q-separator dark class="q-my-md opacity-10" />
              </div>
            </div>
          </q-expansion-item>

        </q-form>
      </q-card-section>
      
      <q-card-actions align="center" class="q-pb-xl q-px-xl">
        <q-btn flat label="Abbrechen" color="white" class="luxury-btn-outline q-px-lg" @click="closeEditDialog" />
        <q-btn 
          label="Speichern" 
          color="secondary" 
          class="luxury-btn q-px-xl q-ml-md" 
          @click="updateItem"
          :loading="isUpdating"
          :disable="uploadStatus === 'uploading'"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from "quasar";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api, { getBaseURL } from "src/boot/axios";
import type { Allergene } from "../types/AllergeneType";
import type { Zusatzstoffe } from "../types/ZusatzstoffeType";
import type { SaucenType } from "../types/SaucenType";
import type { QInput } from "quasar";

const { logAudit, getCurrentUsername } = useAuditLogger();

const $q = useQuasar();
const editImagePreview = ref("");
const selectedEditFile = ref<File | null>(null);
const isUpdating = ref(false);
const uploadStatus = ref<"idle" | "uploading" | "success" | "error">("idle");
const originalImageUrl = ref("");
const newUploadedImageUrl = ref("");
const allergene = ref<Allergene[]>([]);
const zusatzstoffe = ref<Zusatzstoffe[]>([]);
const saucen = ref<SaucenType[]>([]);

const kleinPrice = ref("");
const mittelPrice = ref("");
const großPrice = ref("");
const singlePrice = ref("");
const familiePrice = ref("");
const inputRef = ref<QInput | null>(null);

const measureTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
};

const chipStyle = computed(() => {
  if (!editItem.name) return { display: "none" };

  let font = "16px sans-serif";
  if (inputRef.value) {
    const inputEl = (inputRef.value.$el as Element)?.querySelector("input");
    if (inputEl) {
      const cs = window.getComputedStyle(inputEl);
      font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    }
  }

  const textWidth = measureTextWidth(editItem.name, font);
  const inputPaddingLeft = 64;
  const chipHeight = 24;
  const textLineCenter = 35;

  return {
    position: "absolute",
    left: `${inputPaddingLeft + textWidth + 4}px`,
    top: `${textLineCenter - chipHeight / 2}px`,
    zIndex: "10",
    pointerEvents: "none",
    margin: "0",
  };
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
  hasBeilagen: boolean;
  allergeneIds: number[];
  zusatzstoffeIds: number[];
  hasSaucen: boolean;
  saucenIds: number[];
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
  hasBeilagen?: boolean | undefined;
  allergeneIds?: number[] | undefined;
  zusatzstoffeIds?: number[] | undefined;
  hasSaucen?: boolean | undefined;
  saucenIds?: number[] | undefined;
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
  hasBeilagen: props.hasBeilagen,
  allergeneIds: props.allergeneIds || [],
  zusatzstoffeIds: props.zusatzstoffeIds || [],
  saucenIds: props.saucenIds || [],
  hasSaucen: props.hasSaucen,
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
      Id: editItem.id,
      Name: editItem.name,
      Img: editItem.img,
      Description: editItem.description,
      Price: editItem.price,
      CategoryId: editItem.categoryId || props.categoryId,
      HasSizes: editItem.hasSizes,
      ...(editItem.hasSizes ? { Sizes: editItem.sizes } : { Sizes: [] }),
      SortOrder: editItem.sortOrder,
      Neu: editItem.neu,
      HasBeilagen: editItem.hasBeilagen,
      AllergeneIds: editItem.allergeneIds || [],
      ZusatzstoffeIds: editItem.zusatzstoffeIds || [],
      HasSaucen: editItem.hasSaucen,
      SaucenIds: Array.isArray(editItem.saucenIds) ? editItem.saucenIds : [],
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
        hasBeilagen: oldItem.hasBeilagen,
        hasSaucen: oldItem.hasSaucen,
      },
      newValues: {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        img: editItem.img,
        sortOrder: editItem.sortOrder,
        neu: editItem.neu,
        hasSizes: editItem.hasSizes,
        hasBeilagen: editItem.hasBeilagen,
        hasSaucen: editItem.hasSaucen,
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
      editItem.hasBeilagen = props.item.hasBeilagen;
      editItem.allergeneIds = props.item.allergeneIds;
      editItem.zusatzstoffeIds = props.item.zusatzstoffeIds;
      editItem.hasSaucen = props.item.hasSaucen;
      editItem.saucenIds = Array.isArray(props.item.saucenIds)
        ? [...props.item.saucenIds]
        : [];

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
.premium-glass-card {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
  color: white;
}

.custom-dialog-width {
  width: 900px;
  max-width: 95vw;
}

.premium-glass-card-inner {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
  width: 100%;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 50px;
  min-width: 200px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.luxury-btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  height: 50px;
}

.preview-container {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--q-secondary);
}

.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}

.border-left-accent {
  border-left: 2px solid var(--q-secondary);
  margin-left: 10px;
}

.tracking-widest { letter-spacing: 3px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

.floating-chip {
  transition: left 0.1s ease;
  box-shadow: 0 0 10px rgba(var(--q-secondary), 0.5);
  pointer-events: none;
}
</style>
