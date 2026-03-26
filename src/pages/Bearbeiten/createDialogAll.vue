<template>
  <q-dialog v-model="createDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card class="premium-glass-card custom-dialog-width shadow-24">
      
      <q-card-section>
        <div class="text-center q-mb-xl">
          <div class="text-overline text-secondary text-weight-bold tracking-widest">NEUANLAGE</div>
          <div class="text-h5 text-white text-weight-light uppercase">{{ dialogTitle }}</div>
        </div>

        <q-form @submit="createItem" class="full-width" style="display:flex; flex-direction:column; gap:16px;">
          
          <div class="relative-position full-width">
            <q-input
              dark filled
              v-model="itemData.name"
              label="Name"
              class="premium-input full-width"
              :rules="[(val: string) => !!val || 'Name ist erforderlich']"
              ref="inputRef"
            >
              <template v-slot:prepend><q-icon name="edit" /></template>
              <template v-slot:append>
                <div class="row items-center no-wrap">
                  <q-item-label caption class="text-grey-5 q-mr-sm">Neu:</q-item-label>
                  <q-toggle checked-icon="check" color="secondary" v-model="itemData.neu" keep-color />
                </div>
              </template>
            </q-input>

            <q-chip
              v-if="itemData.neu === true && itemData.name"
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
              v-model="selectedFile"
              label="Bild hochladen"
              accept="image/*"
              class="premium-input full-width"
              @update:model-value="onFileSelected"
              :rules="[(val: any) => !!val || 'Bild ist erforderlich']"
            >
              <template v-slot:prepend><q-icon name="file_upload" /></template>
            </q-file>

            <div v-if="uploadStatus !== 'idle'" class="q-mt-sm">
              <q-linear-progress
                v-if="uploadStatus === 'uploading'"
                :value="uploadProgress / 100"
                color="secondary"
                size="10px"
                rounded
                class="q-mt-md"
              />
              <div v-if="uploadStatus === 'success'" class="text-secondary text-caption q-mt-xs">
                <q-icon name="check_circle" /> Bild bereit
              </div>
            </div>

            <div v-if="imagePreview" class="flex justify-center q-mt-md">
              <div class="preview-container shadow-10">
                <q-img :src="imagePreview" class="rounded-borders full-height" />
              </div>
            </div>
          </div>

          <q-input
            dark filled
            v-model="itemData.description"
            label="Beschreibung"
            type="textarea"
            class="premium-input full-width"
            :rules="[(val: string) => !!val || 'Beschreibung ist erforderlich']"
          >
            <template v-slot:prepend><q-icon name="description" /></template>
          </q-input>

          <div class="q-gutter-y-sm full-width">
            <div class="option-row">
              <q-toggle dark color="secondary" v-model="itemData.hasSaucen" label="Saucen verfügbar" left-label class="full-width justify-between" />
            </div>
            
            <q-slide-transition>
              <div v-if="itemData.hasSaucen" class="q-pl-md q-pb-md border-left-accent full-width">
                <div v-for="sauce in saucenName" :key="sauce.id" class="row items-center q-mb-xs">
                  <q-checkbox dark v-model="selectedSauce" :val="sauce.id" color="secondary" />
                  <span class="text-caption text-grey-4">{{ sauce.name }}</span>
                </div>
              </div>
            </q-slide-transition>

            <div class="option-row">
              <q-toggle dark color="secondary" v-model="itemData.hasBeilagen" label="Beilagen verfügbar" left-label class="full-width justify-between" />
            </div>

            <q-slide-transition>
              <div v-if="itemData.hasBeilagen" class="q-pl-md q-pb-md border-left-accent full-width">
                <div v-for="beilage in beilagenName" :key="beilage.id" class="row items-center q-mb-xs">
                  <q-checkbox dark v-model="selectedBeilagen" :val="beilage.id" color="secondary" />
                  <span class="text-caption text-grey-4">{{ beilage.beilageName }}</span>
                </div>
              </div>
            </q-slide-transition>

            <div class="option-row">
              <q-toggle dark color="secondary" v-model="hasSizesLocal" label="Verschiedene Größen" left-label class="full-width justify-between" />
            </div>
          </div>

          <div class="price-section q-mt-md full-width">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Preiskonfiguration</div>
            
            <div v-if="hasSizesLocal" class="q-gutter-y-md">
              <q-input dark filled prefix="€" v-model="kleinPrice" label="Klein" class="premium-input full-width" :readonly="!sizeKleinOn" @focus="handleFocus('klein')" @blur="handleBlur('klein')">
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
                <q-checkbox dark dense v-model="selectedAllergene" :val="a.id" :label="a.name" class="text-caption" />
                 <q-separator dark class="q-my-md opacity-10  " />
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
                <q-checkbox dark dense v-model="selectedZusatzstoffe" :val="z.id" :label="z.name" class="text-caption" />
                <q-separator dark class="q-my-md opacity-10  " />
              </div>
            </div>
          </q-expansion-item>

        </q-form>
      </q-card-section>
      
      <q-card-actions align="center" class="q-pb-xl q-px-xl">
        <q-btn flat label="Abbrechen" color="white" class="luxury-btn-outline q-px-lg" @click="closeCreateDialog" />
        <q-btn 
          :label="createButtonText" 
          color="secondary" 
          class="luxury-btn q-px-xl q-ml-md" 
          @click="createItem"
          :loading="isCreating"
          :disable="!selectedFile || uploadStatus === 'uploading'"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from "quasar";
import type { QInput } from "quasar";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import type { ItemSizes } from "../types/CategoryItemsSizes";
import api from "src/boot/axios";
import type { Allergene } from "../types/AllergeneType";
import type { Zusatzstoffe } from "../types/ZusatzstoffeType";
import type { SaucenType } from "../types/SaucenType";
import type { BeilagenName } from "../types/BeilagenType";

const saucenName = ref<SaucenType[]>([]);
const selectedSauce = ref<number[]>([]);
const beilagenName = ref<BeilagenName[]>([]);
const selectedBeilagen = ref<number[]>([]);
const allergene = ref<Allergene[]>([]);
const selectedAllergene = ref<number[]>([]);
const selectedZusatzstoffe = ref<number[]>([]);
const zusatzstoffe = ref<Zusatzstoffe[]>([]);
const { logAudit, getCurrentUsername } = useAuditLogger();
const uploadProgress = ref(0);
const isUploading = ref(false);

interface ItemData {
  name: string;
  img: string;
  description: string;
  price: number;
  hasSizes: boolean;
  categoryId: number;
  sortOrder: number;
  neu: boolean;
  sizes?: ItemSizes;
  hasBeilagen: boolean;
  hasSaucen: boolean;
}

interface SizeData {
  sizeName: string;
  price: number;
}

const nextSortOrder = ref(0);

const computedSortOrder = computed(() => {
  return nextSortOrder.value;
});

const loadNextSortOrder = async () => {
  try {
    const response = await api.get(
      `/api/categoryItems/next-sort-order/${props.categoryId}`
    );
    nextSortOrder.value = response.data.nextSortOrder || 1;
  } catch (error) {
    console.error("Fehler beim Laden der nächsten sortOrder:", error);
    nextSortOrder.value = 1;
  }
};

const props = defineProps<{
  modelValue: boolean;
  dialogTitle: string;
  createButtonText: string;
  categoryId: number;
  imageUrlHint: string;
  uploadEndpoint?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "item-created": [];
}>();

const createDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const $q = useQuasar();
const selectedFile = ref<File | null>(null);
const imagePreview = ref("");
const isCreating = ref(false);
const uploadStatus = ref<"idle" | "uploading" | "success" | "error">("idle");

const hasSizesLocal = ref(false);

const kleinPrice = ref("0.00");
const mittelPrice = ref("0.00");
const großPrice = ref("0.00");
const familiePrice = ref("0.00");
const singlePrice = ref("0.00");
const sizeKleinOn = ref(true);
const sizeMittelOn = ref(true);
const sizeGrossOn = ref(true);
const sizeFamilieOn = ref(true);
const inputRef = ref<QInput | null>(null);

const measureTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
};

const chipStyle = computed(() => {
  if (!itemData.name) return { display: "none" };

  let font = "16px sans-serif";
  if (inputRef.value) {
    const inputEl = (inputRef.value.$el as Element)?.querySelector("input");
    if (inputEl) {
      const cs = window.getComputedStyle(inputEl);
      font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    }
  }

  const textWidth = measureTextWidth(itemData.name, font);
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

const defaultItemData: ItemData = {
  name: "",
  img: "",
  description: "",
  price: 0,
  hasSizes: hasSizesLocal.value,
  categoryId: props.categoryId,
  sortOrder: 0,
  neu: false,
  hasBeilagen: false,
  hasSaucen: false,
};

const itemData = reactive<ItemData>({
  ...defaultItemData,
});

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

  if (!isNaN(value)) {
    currentRef.value = value.toFixed(2);
  } else {
    currentRef.value = "0.00";
  }

  if (size === "mittel") {
    itemData.price = value;
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
    itemData.price = value;
  } else {
    singlePrice.value = "0.00";
    itemData.price = 0;
  }
};

const uploadImage = async (
  file: File,
  uploadPath = "api/uploads/images"
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file, file.name);

  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    const response = await api.post(uploadPath, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      },
    });

    const result = response.data;

    return result.imageUrl || result.url || result.path;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

const onFileSelected = async (file: File | null) => {
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = "idle";

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    try {
      uploadStatus.value = "uploading";

      const uploadedImageUrl = await uploadImage(file);

      itemData.img = uploadedImageUrl;
      uploadStatus.value = "success";

      $q.notify({
        type: "positive",
        position: "top",
        message: "Bild erfolgreich hochgeladen!",
      });
    } catch {
      uploadStatus.value = "error";
      itemData.img = "";

      $q.notify({
        type: "negative",
        position: "top",
        message: "Fehler beim Hochladen des Bildes",
      });
    }
  } else {
    selectedFile.value = null;
    imagePreview.value = "";
    itemData.img = "";
    uploadStatus.value = "idle";
  }
};

const closeCreateDialog = () => {
  Object.assign(itemData, {
    name: "",
    img: "",
    description: "",
    price: 0,
    categoryId: props.categoryId,
  });

  hasSizesLocal.value = false;
  kleinPrice.value = "0.00";
  mittelPrice.value = "0.00";
  großPrice.value = "0.00";
  familiePrice.value = "0.00";
  singlePrice.value = "0.00";

  selectedFile.value = null;
  imagePreview.value = "";
  uploadStatus.value = "idle";

  selectedAllergene.value = [];
  selectedZusatzstoffe.value = [];
  selectedSauce.value = [];
  selectedBeilagen.value = [];

  emit("update:modelValue", false);
};

const createCategoryItemSizes = async (
  categoryItemId: number,
  sizes: SizeData[],
  hasSizes: boolean
) => {
  try {
    for (const size of sizes) {
      await api.post("/api/categoryItemSizes", {
        categoryItemId: categoryItemId,
        SizeName: size.sizeName,
        price: size.price,
        hasSizes: hasSizes,
      });
    }
  } catch (error) {
    console.error("Fehler beim Erstellen der Größen:", error);
    throw error;
  }
};

const createItem = async () => {
  if (!itemData.name || !itemData.img || !itemData.description) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Bitte füllen Sie alle Felder korrekt aus",
    });
    return;
  }

  let sizesData: SizeData[] = [];

  if (hasSizesLocal.value) {
    const kleinValue = parseFloat(
      kleinPrice.value.toString().replace(",", ".")
    );
    const mittelValue = parseFloat(
      mittelPrice.value.toString().replace(",", ".")
    );
    const großValue = parseFloat(großPrice.value.toString().replace(",", "."));
    const familieValue = parseFloat(
      familiePrice.value.toString().replace(",", ".")
    );

    const sizes = [
      { sizeName: "Klein", price: kleinValue },
      { sizeName: "Mittel", price: mittelValue },
      { sizeName: "Groß", price: großValue },
      { sizeName: "Familie", price: familieValue },
    ];

    const validSizes = sizes.filter((s) => !isNaN(s.price) && s.price > 0);

    if (validSizes.length >= 2) {
      itemData.price =
        validSizes.find((s) => s.sizeName === "Klein")?.price ??
        validSizes[0]!.price;
      sizesData = validSizes;
    } else {
      const singleValue = parseFloat(
        singlePrice.value.toString().replace(",", ".")
      );

      if (singleValue <= 0 || isNaN(singleValue)) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Bitte geben Sie einen gültigen Einzelpreis ein",
        });
        return;
      }

      itemData.price = singleValue;
      sizesData = [];
    }
  } else {
    const singleValue = parseFloat(
      singlePrice.value.toString().replace(",", ".")
    );

    if (singleValue <= 0 || isNaN(singleValue)) {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Bitte geben Sie einen gültigen Einzelpreis ein",
      });
      return;
    }

    itemData.price = singleValue;
    sizesData = [];
  }

  if (uploadStatus.value !== "success") {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Bitte warten Sie bis das Bild vollständig hochgeladen ist",
    });
    return;
  }

  isCreating.value = true;
  itemData.sortOrder = computedSortOrder.value;
  try {
    const { data: createdCategoryItem } = await api.post("/api/categoryItems", {
      name: itemData.name,
      img: itemData.img,
      description: itemData.description,
      price: itemData.price,
      hasSizes: hasSizesLocal.value,
      categoryId: props.categoryId,
      sortOrder: itemData.sortOrder,
      neu: itemData.neu,
      hasBeilagen: itemData.hasBeilagen,
      hasSaucen: itemData.hasSaucen,
      allergeneIds: selectedAllergene.value,
      zusatzstoffeIds: selectedZusatzstoffe.value,
      saucenIds: selectedSauce.value,
      beilagenIds: selectedBeilagen.value,
    });

    const categoryName = await getCategoryNameById(props.categoryId);
    const currentUser = getCurrentUsername();

    await logAudit("create", "categoryItem", createdCategoryItem.id, {
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      img: itemData.img,
      username: currentUser,
      hasBeilagen: itemData.hasBeilagen,
      hasSaucen: itemData.hasSaucen,
      neu: itemData.neu,
      message: `Item "${itemData.name}" wurde in Kategorie "${categoryName}" erstellt${hasSizesLocal.value ? " (mit Größen)" : ""}`,
    });

    if (hasSizesLocal.value && sizesData.length > 0) {
      await createCategoryItemSizes(
        createdCategoryItem.id,
        sizesData,
        hasSizesLocal.value
      );
    }

    $q.notify({
      type: "positive",
      position: "top",
      message: `${props.dialogTitle.replace("Neues", "").replace("erstellen", "").trim()} wurde erfolgreich erstellt!`,
    });

    closeCreateDialog();
    emit("item-created");
  } catch (error) {
    console.error("Fehler beim Erstellen:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Erstellen",
    });
  } finally {
    isCreating.value = false;
  }
};

async function loadSaucen() {
  try {
    const response = await api.get("/api/saucen");
    saucenName.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Saucen", error);
  }
}

async function loadBeilagen() {
  try {
    const response = await api.get("/api/beilagen/beilagenname");
    beilagenName.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Beilagen", error);
  }
}

const getCategoryNameById = async (categoryId: number): Promise<string> => {
  try {
    const response = await api.get(`/api/category/${categoryId}`);
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

onMounted(async () => {
  await getAllergeneZusatzstoffe();
  await loadSaucen();
  await loadBeilagen();
});

watch(
  () => props.categoryId,
  async () => {
    await loadNextSortOrder();
  }
);
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
  transition: left 0.05s ease;
  box-shadow: 0 0 10px rgba(var(--q-secondary), 0.5);
  pointer-events: none;
}
</style>