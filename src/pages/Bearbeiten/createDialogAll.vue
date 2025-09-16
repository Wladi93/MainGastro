<template>
  <q-dialog v-model="createDialog" persistent>
    <q-card style="min-width: 350px; width: 1000px">
      <q-card-section>
        <div class="text-h6">{{ dialogTitle }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="createItem" class="q-gutter-md">
          <div class="relative-position">
            <q-input
              filled
              v-model="itemData.name"
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
                    v-model="itemData.neu"
                  />
                </div>
              </template>
            </q-input>

            <q-chip
              v-if="itemData.neu === true && itemData.name"
              label="Neu"
              color="info"
              clickable
              @click.stop
              :style="chipStyle"
              class="floating-chip"
            />
          </div>
          <div class="">
            <q-file
              filled
              v-model="selectedFile"
              label="Bild hochladen"
              accept="image/*"
              @update:model-value="onFileSelected"
              hint="Wähle ein Bild für das Item"
              :rules="[(val) => !!val || 'Bild ist erforderlich']"
            >
              <template v-slot:prepend>
                <q-icon name="file_upload" />
              </template>
            </q-file>
            <div v-if="isUploading">
              <h6 class="text-caption">Upload-Status:</h6>
            </div>

            <div v-if="uploadStatus" class="q-mt-sm">
              <q-linear-progress
                v-if="uploadStatus === 'uploading'"
                :value="uploadProgress / 100"
                color="positive"
                size="16px"
                class="q-mt-sm"
                rounded
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="secondary"
                    :label="`${uploadProgress}%`"
                  />
                </div>
              </q-linear-progress>
              <div
                v-if="uploadStatus === 'success'"
                class="text-green text-caption"
              >
                <q-icon name="check_circle" /> Bild erfolgreich hochgeladen
              </div>
              <div
                v-if="uploadStatus === 'error'"
                class="text-red text-caption"
              >
                <q-icon name="error" /> Fehler beim Hochladen
              </div>
            </div>

            <div v-if="imagePreview" class="q-mt-sm">
              <div class="text-caption q-mb-xs">Vorschau:</div>
              <div style="display: flex; justify-content: center">
                <q-card style="height: 101px; width: 101px">
                  <q-img
                    :src="imagePreview"
                    style="height: 100px; max-width: 100px"
                    class="rounded-borders"
                  />
                </q-card>
              </div>
            </div>
          </div>

          <q-input
            filled
            v-model="itemData.description"
            label="Beschreibung"
            type="textarea"
            :rules="[(val) => !!val || 'Beschreibung ist erforderlich']"
          />

          <q-toggle
            class="text-caption text-grey-8"
            label="auswählen von Saucen"
            left-label
            color="positive"
            v-model="itemData.hasSaucen"
            style="margin-bottom: -18px"
          />

          <q-item v-if="itemData.hasSaucen">
            <q-list class="full-width">
              <div v-for="sauce in saucenName" :key="sauce.id">
                <q-checkbox
                  v-model="selectedSauce"
                  :val="sauce.id"
                  class="text-caption"
                />
                <q-chip color="info" dense>{{ sauce.name }}</q-chip>
                <q-separator inset />
              </div>
            </q-list>
          </q-item>

          <q-toggle
            class="text-caption text-grey-8"
            label="auswählen von Beilagen"
            left-label
            color="positive"
            v-model="itemData.hasBeilagen"
            style="margin-bottom: -18px"
          />

          <q-toggle
            class="text-caption text-grey-8"
            v-model="hasSizesLocal"
            left-label
            label="verschiedene Größen"
            color="positive"
          />

          <!-- Preise für Items mit Größen (Pizza) -->
          <div v-if="hasSizesLocal" class="text-caption q-mt-md text-grey-7">
            Preise:
          </div>

          <template v-if="hasSizesLocal">
            <q-input
              prefix="€"
              :key="sizeKleinOn ? 1 : 0"
              :readonly="!sizeKleinOn"
              filled
              v-model="kleinPrice"
              label="Klein:"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Klein ist erforderlich',
              ]"
              @focus="handleFocus('klein')"
              @blur="handleBlur('klein')"
            >
              <template v-slot:append>
                <q-checkbox v-model="sizeKleinOn" />
              </template>
            </q-input>

            <q-input
              prefix="€"
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
              :key="sizeGrossOn ? 1 : 0"
              :readonly="!sizeGrossOn"
              filled
              v-model="großPrice"
              label="Groß:"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Groß ist erforderlich',
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
              :key="sizeFamilieOn ? 1 : 0"
              :readonly="!sizeFamilieOn"
              filled
              v-model="familiePrice"
              label="Familie:"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Familie ist erforderlich',
              ]"
              @focus="handleFocus('familie')"
              @blur="handleBlur('familie')"
            >
              <template v-slot:append>
                <q-checkbox v-model="sizeFamilieOn" />
              </template>
            </q-input>
          </template>

          <!-- Einzelpreis für Items ohne Größen -->
          <q-input
            prefix="€"
            v-else
            filled
            v-model="singlePrice"
            label="Preis:"
            type="text"
            step="0.01"
            min="0"
            :rules="[(val) => parseFloat(val) > 0 || 'Preis ist erforderlich']"
            @focus="handleSinglePriceFocus"
            @blur="handleSinglePriceBlur"
          />

          <q-expansion-item
            expand-separator
            label="Allergene"
            header-class="bg-grey-3"
            icon="list"
          >
            <q-list>
              <div v-for="allergen in allergene" :key="allergen.id">
                <q-checkbox
                  v-model="selectedAllergene"
                  :val="allergen.id"
                  :label="allergen.name"
                  class="text-caption"
                />
                <q-separator inset />
              </div>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            label="Zusatzstoffe"
            header-class="bg-grey-3"
            icon="list"
          >
            <q-list>
              <div v-for="zusatzstoff in zusatzstoffe" :key="zusatzstoff.id">
                <q-checkbox
                  v-model="selectedZusatzstoffe"
                  :val="zusatzstoff.id"
                  :label="zusatzstoff.name"
                  class="text-caption"
                />
                <q-separator inset />
              </div>
            </q-list>
          </q-expansion-item>
        </q-form>
      </q-card-section>

      <div
        class="row"
        style="display: flex; justify-content: center; align-items: center"
      >
        <q-card-actions align="right" class="text-primary">
          <q-btn
            color="negative"
            flat
            label="Abbrechen"
            @click="closeCreateDialog"
          />
          <q-btn
            :label="createButtonText"
            @click="createItem"
            :loading="isCreating"
            :disable="!selectedFile || uploadStatus === 'uploading'"
            color="secondary"
          />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify, useQuasar } from "quasar";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import type { ItemSizes } from "../types/CategoryItemsSizes";
import api from "src/boot/axios";
import type { Allergene } from "../types/AllergeneType";
import type { Zusatzstoffe } from "../types/ZusatzstoffeType";
import type { SaucenType } from "../types/SaucenType";

const saucenName = ref<SaucenType[]>([]);
const selectedSauce = ref<number[]>([]);
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

//sizes

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

const chipStyle = computed(() => {
  if (!itemData.name) return { display: "none" };
  const textWidth = itemData.name.length * 6.6;
  const leftPosition = Math.min(textWidth + 20, 300);

  return {
    position: "absolute",
    left: `${leftPosition}px`,
    top: "42%",
    transform: "translateY(-50%)",
    zIndex: "10",
    pointerEvents: "auto",
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
});

watch(
  () => props.categoryId,
  async () => {
    await loadNextSortOrder();
  }
);
</script>

<style scoped>
.floating-chip {
  transition: left 0.2s ease;
}

.relative-position {
  position: relative;
}
</style>
