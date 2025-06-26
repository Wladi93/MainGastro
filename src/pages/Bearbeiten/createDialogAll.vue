<template>
  <q-dialog v-model="createDialog" persistent>
    <q-card style="min-width: 350px; width: 1000px">
      <q-card-section>
        <div class="text-h6">{{ dialogTitle }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="createItem" class="q-gutter-md">
          <q-input
            filled
            v-model="itemData.name"
            label="Name"
            :rules="[(val) => !!val || 'Name ist erforderlich']"
            ref="nameInput"
          />

          <div class="q-gutter-sm">
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

            <div v-if="uploadStatus" class="q-mt-sm">
              <q-linear-progress
                v-if="uploadStatus === 'uploading'"
                indeterminate
                color="primary"
                class="q-mt-xs"
              />
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

          <!-- Preise für Items mit Größen (Pizza) -->
          <div v-if="hasSizesLocal" class="text-subtitle2 q-mt-md">Preise:</div>

          <template v-if="hasSizesLocal">
            <q-input
              filled
              v-model="kleinPrice"
              label="Klein (€)"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Klein ist erforderlich',
              ]"
              @focus="handleFocus('klein')"
              @blur="handleBlur('klein')"
            />

            <q-input
              filled
              v-model="mittelPrice"
              label="Mittel (€)"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Mittel ist erforderlich',
              ]"
              @focus="handleFocus('mittel')"
              @blur="handleBlur('mittel')"
            />

            <q-input
              filled
              v-model="großPrice"
              label="Groß (€)"
              type="text"
              step="0.01"
              min="0"
              :rules="[
                (val) =>
                  parseFloat(val) > 0 || 'Preis für Groß ist erforderlich',
              ]"
              @focus="handleFocus('groß')"
              @blur="handleBlur('groß')"
            />
          </template>

          <!-- Einzelpreis für Items ohne Größen -->
          <q-input
            v-else
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
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { reactive, ref, computed } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
const { logAudit, getCurrentUsername } = useAuditLogger();

interface ItemData {
  name: string;
  img: string;
  description: string;
  price: number;
  hasSizes: boolean;
  categoryId: number;
}

interface SizeData {
  sizeName: string;
  price: number;
}

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

// Preise für Items mit Größen
const kleinPrice = ref("0.00");
const mittelPrice = ref("0.00");
const großPrice = ref("0.00");

const singlePrice = ref("0.00");

const defaultItemData: ItemData = {
  name: "",
  img: "",
  description: "",
  price: 0,
  hasSizes: hasSizesLocal.value,
  categoryId: props.categoryId,
};

const itemData = reactive<ItemData>({
  ...defaultItemData,
});

const handleFocus = (size: "klein" | "mittel" | "groß") => {
  const currentRef =
    size === "klein" ? kleinPrice : size === "mittel" ? mittelPrice : großPrice;
  if (currentRef.value === "0" || currentRef.value === "0.00") {
    currentRef.value = "";
  }
};

const handleBlur = (size: "klein" | "mittel" | "groß") => {
  const currentRef =
    size === "klein" ? kleinPrice : size === "mittel" ? mittelPrice : großPrice;

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

const uploadImage = async (file: File): Promise<string> => {
  const uploadEndpoint =
    props.uploadEndpoint || "http://localhost:5008/api/uploads/images";

  const formData = new FormData();
  formData.append("image", file, file.name);

  try {
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Upload result:", result);

    return result.imageUrl || result.url || result.path;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
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
        message: "Bild erfolgreich hochgeladen!",
        timeout: 2000,
      });
    } catch {
      uploadStatus.value = "error";
      itemData.img = "";

      $q.notify({
        type: "negative",
        message: "Fehler beim Hochladen des Bildes",
        timeout: 3000,
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
  singlePrice.value = "0.00";

  selectedFile.value = null;
  imagePreview.value = "";
  uploadStatus.value = "idle";

  emit("update:modelValue", false);
};

const createCategoryItemSizes = async (
  categoryItemId: number,
  sizes: SizeData[]
) => {
  try {
    for (const size of sizes) {
      const response = await fetch(
        "http://localhost:5008/api/categoryItemSizes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryItemId: categoryItemId,
            SizeName: size.sizeName,
            price: size.price,
            hasSizes: hasSizesLocal.value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Fehler beim Erstellen der Größe ${size.sizeName}`);
      }
    }
  } catch (error) {
    console.error("Error creating sizes:", error);
    throw error;
  }
};

const createItem = async () => {
  if (!itemData.name || !itemData.img || !itemData.description) {
    $q.notify({
      type: "negative",
      message: "Bitte füllen Sie alle Felder korrekt aus",
    });
    return;
  }

  // Validierung der Preise
  let sizesData: SizeData[] = [];

  if (hasSizesLocal.value) {
    const kleinValue = parseFloat(
      kleinPrice.value.toString().replace(",", ".")
    );
    const mittelValue = parseFloat(
      mittelPrice.value.toString().replace(",", ".")
    );
    const großValue = parseFloat(großPrice.value.toString().replace(",", "."));

    if (
      kleinValue <= 0 ||
      mittelValue <= 0 ||
      großValue <= 0 ||
      isNaN(kleinValue) ||
      isNaN(mittelValue) ||
      isNaN(großValue)
    ) {
      $q.notify({
        type: "negative",
        message: "Bitte füllen Sie alle Preise korrekt aus",
      });
      return;
    }

    itemData.price = mittelValue; // Hauptpreis für Anzeige
    sizesData = [
      { sizeName: "Klein", price: kleinValue },
      { sizeName: "Mittel", price: mittelValue },
      { sizeName: "Groß", price: großValue },
    ];
  } else {
    const singleValue = parseFloat(
      singlePrice.value.toString().replace(",", ".")
    );

    if (singleValue <= 0 || isNaN(singleValue)) {
      $q.notify({
        type: "negative",
        message: "Bitte geben Sie einen gültigen Preis ein",
      });
      return;
    }

    itemData.price = singleValue;
  }

  if (uploadStatus.value !== "success") {
    $q.notify({
      type: "negative",
      message: "Bitte warten Sie bis das Bild vollständig hochgeladen ist",
    });
    return;
  }

  isCreating.value = true;

  try {
    const categoryItemResponse = await fetch(
      "http://localhost:5008/api/categoryItems",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemData.name,
          img: itemData.img,
          description: itemData.description,
          price: itemData.price,
          hasSizes: hasSizesLocal.value,
          categoryId: props.categoryId,
        }),
      }
    );

    if (!categoryItemResponse.ok) {
      throw new Error("Fehler beim Erstellen des Items");
    }

    const createdCategoryItem = await categoryItemResponse.json();

    const categoryName = await getCategoryNameById(props.categoryId);
    const currentUser = getCurrentUsername();

    await logAudit("create", "categoryItem", createdCategoryItem.id, {
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      img: itemData.img,
      username: currentUser,
      message: `Item "${itemData.name}" wurde in Kategorie "${categoryName}" erstellt${hasSizesLocal.value ? " (mit Größen)" : ""}`,
    });

    if (hasSizesLocal.value && sizesData.length > 0) {
      await createCategoryItemSizes(createdCategoryItem.id, sizesData);
    }

    $q.notify({
      type: "positive",
      message: `${props.dialogTitle.replace("Neues", "").replace("erstellen", "").trim()} wurde erfolgreich erstellt!`,
    });

    closeCreateDialog();
    emit("item-created");
  } catch (error) {
    console.error("Error creating item:", error);
    $q.notify({
      type: "negative",
      message: "Fehler beim Erstellen",
    });
  } finally {
    isCreating.value = false;
  }
};

const getCategoryNameById = async (categoryId: number): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:5008/api/category/${categoryId}`
    );
    if (!response.ok) {
      throw new Error("Kategorie nicht gefunden");
    }
    const category = await response.json();
    return category.name;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorie:", error);
    return "Unbekannte Kategorie";
  }
};
</script>

<style scoped></style>
