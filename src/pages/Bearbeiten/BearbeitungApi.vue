<template>
  <div class="sticky-tabs">
    <q-banner class="banner full-width text-secondary">
      <h6 class="bannerText">
        <q-icon class="bannerIcon" name="edit" />
        Speisekarte bearbeiten
      </h6>
    </q-banner>

    <div class="above bg-white">
      <q-separator color="secondary" />
      <q-card class="full-width text-center">
        <q-card-section class="row justify-evenly q-gutter-sm">
          <q-btn
            label="tab erstellen"
            outline
            dense
            size="md"
            class="banner col"
            color="secondary"
            icon="dashboard_customize"
            @click="showCategoryDialog = true"
          />

          <q-btn
            label="tab löschen"
            outline
            dense
            size="md"
            class="banner col"
            color="negative"
            icon="delete"
            @click="showCategoryDeleteDialog = true"
          />
        </q-card-section>
      </q-card>
    </div>

    <q-img class="background-img" />
    <q-card class="tabsBorder sticky-tabs">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-9"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
        inline-label
        swipeable
        infinite
      >
        <q-tab
          v-for="category in categories"
          :key="category.sortOrder"
          @click="onTabChange"
          :name="category.name"
          :label="category.name"
          :icon="category.icon"
          class="drag-handle2"
        >
        </q-tab>
      </q-tabs>
    </q-card>
  </div>

  <div class="tab-panels-container">
    <q-card class="background-img"></q-card>

    <div
      v-for="category in categories"
      :key="category.apiEndpoint"
      v-show="true"
      :ref="(el: any) => setSectionRef(category.name, el)"
    >
      <q-card class="q-gutter-y-xl drag-tab">
        <div class="tab-section-name">
          <q-card-section class="card-section3 bannerHeight">
            <q-img
              :src="getFullImageUrl(category.bannerImage)"
              spinner-color="white"
              :alt="`${category.name} Banner`"
              style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
              "
            >
              <div
                class="text-white absolute-bottom text-center"
                style="font-size: 18px"
              >
                <q-icon
                  :name="category.icon"
                  color="secondary"
                  size="xs"
                  class="q-mr-xs"
                />
                {{ category.name }}
              </div>
            </q-img>
          </q-card-section>
        </div>
      </q-card>

      <div
        :id="`sortable-${category.id}`"
        class="sortable-container"
        :data-category-id="category.id"
        :data-category-name="category.name"
      >
        <div
          v-for="item in getCategoryItems(category.name)"
          ref="el"
          :key="item.id"
          class="my-card"
        >
          <q-card>
            <q-card-section class="card-section">
              <div class="drag-handle">
                <q-icon
                  name="drag_indicator"
                  color="grey-6"
                  size="sm"
                  class="q-mr-sm"
                />
              </div>
              <q-img
                class="imgGericht"
                v-if="item.img"
                :src="getFullImageUrl(item.img)"
                :alt="item.name"
              />
              <div class="text-container">
                <h6
                  class="text-h6 row"
                  style="display: flex; align-items: center"
                >
                  {{ item.name }}
                  <q-chip color="info" v-if="item.neu == true" label="Neu" />
                </h6>
                <p class="description nowrap">{{ item.description }}</p>
              </div>
              <q-separator vertical class="separatorH q-mr-md" />
              <div class="input-container">
                <q-btn
                  @click="() => openEditDialog(item, category.name)"
                  class="bg-primary text-white"
                  :size="$q.screen.lt.sm ? 'xs' : 'sm'"
                  icon="edit"
                  label="bearbeiten"
                  color="secondary"
                  square
                />
                <h6 class="preisText text-subtitle2 q-mt-md">
                  Preis: {{ item.price ? item.price.toFixed(2) : "0.00" }}€
                </h6>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card>
        <q-card-section>
          <q-btn
            icon="post_add"
            :label="`${category.name.toLowerCase()} erstellen`"
            class="full-width"
            color="secondary"
            @click="openCreateDialogAll(category.name)"
          />
          <q-btn
            icon="delete"
            :label="`${category.name.toLowerCase()} löschen`"
            class="full-width q-mt-sm"
            color="negative"
            @click="openDeleteDialog(category.name)"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- Kategorie erstellen -->
  <q-dialog v-model="showCategoryDialog" persistent>
    <q-card style="min-width: 350px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Neue Kategorie erstellen</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmitCategory" class="q-gutter-md">
          <q-input
            v-model="newCategory.name"
            label="Kategorie Name *"
            hint="z.B. Salate, Hauptgerichte, etc."
            :rules="[(val) => !!val || 'Name ist erforderlich']"
            outlined
          />

          <q-select
            v-model="newCategory.icon"
            :options="iconOptions"
            label="Icon auswählen"
            outlined
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.value" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div class="row items-center">
                <q-icon :name="newCategory.icon" class="q-mr-sm" />
                {{
                  iconOptions.find((opt) => opt.value === newCategory.icon)
                    ?.label
                }}
              </div>
            </template>
          </q-select>

          <div class="q-gutter-sm">
            <q-file
              label="Banner Bild hochladen"
              outlined
              accept="image/*"
              :model-value="null"
              @update:model-value="onBannerFileChange"
              :loading="isUploading"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div v-if="isUploading">
              <h6 class="text-caption">Upload-Status:</h6>
            </div>

            <q-linear-progress
              v-if="isUploading"
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

            <div v-if="bannerPreview" class="q-mt-md">
              <q-img
                :src="bannerPreview"
                style="height: 100px; max-width: 200px"
                class="rounded-borders"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-xl">
            <q-btn label="Abbrechen" color="negative" flat v-close-popup />
            <q-btn
              label="Kategorie erstellen"
              color="secondary"
              type="submit"
              :loading="categoryLoading"
              :disable="!isCategoryFormValid"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Kategorie löschen -->
  <q-dialog v-model="showCategoryDeleteDialog" persistent>
    <q-card style="min-width: 350px; width: 800px">
      <q-card-section class="text-center">
        <div class="text-h6 text-negative">
          <q-icon name="delete" class="q-mr-sm" />
          Kategorien löschen
        </div>
        <div class="text-caption q-mb-md">
          Wählen Sie die Kategorien , die Sie löschen möchten:
        </div>

        <div v-if="categories.length === 0" class="text-center text-grey-6">
          Keine Kategorien verfügbar
        </div>

        <div
          v-else
          class="q-gutter-sm"
          style="max-height: 300px; overflow-y: auto"
        >
          <div class="q-mb-md">
            <q-btn
              size="sm"
              color="secondary"
              @click="selectAllItems"
              :label="
                selectedCategoriesForDeletion.length === categories.length
                  ? 'Alle abwählen'
                  : 'Alle auswählen'
              "
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-card
          v-for="category in categories"
          :key="category.id"
          class="item-delete-item q-mt-sm"
          :class="{
            'selected-for-deletion': selectedCategoriesForDeletion.includes(
              category.id
            ),
          }"
        >
          <q-card-section class="row items-center no-wrap" style="gap: 5px">
            <q-card style="height: 80px; width: 600px">
              <q-img
                v-if="category.bannerImage"
                :src="getFullImageUrl(category.bannerImage)"
                :alt="category.name"
                style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                "
                class="rounded-borders q-mr-md"
              >
                <div
                  class="text-white absolute-bottom text-center"
                  style="font-size: 18px"
                >
                  <q-icon
                    :name="category.icon"
                    color="secondary"
                    size="xs"
                    class="q-mr-xs"
                  />
                  {{ category.name }}
                </div>
              </q-img>
            </q-card>

            <q-checkbox
              v-model="selectedCategoriesForDeletion"
              :val="category.id"
              color="negative"
              class="q-mr-md"
            />
          </q-card-section>
        </q-card>

        <div
          v-if="selectedCategoriesForDeletion.length > 0"
          class="q-mt-md text-negative"
        >
          <q-icon name="warning" class="q-mr-xs" />
          {{ selectedCategoriesForDeletion.length }} Kategorien werden gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden!
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Abbrechen" color="grey" flat v-close-popup />
        <q-btn
          label="Löschen"
          color="negative"
          :disable="selectedCategoriesForDeletion.length === 0"
          :loading="isDeleting"
          @click="deleteCategory"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <createDialogAll
    v-model="createDialog.show"
    :dialog-title="createDialog.title"
    :create-button-text="createDialog.buttonText"
    :category-id="createDialog.categoryId"
    upload-endpoint="http://localhost:5008/api/uploads/images"
    :image-url-hint="createDialog.imageHint"
    @item-created="createDialog.onCreated"
  />

  <editDialogAll
    v-model="editDialog.show"
    :item="editDialog.item"
    :has-sizes="editDialog.item?.hasSizes"
    :sizes="editDialog.item?.sizes"
    :category-id="editDialog.item?.categoryId"
    :dialog-title="editDialog.title"
    :api-endpoint="editDialog.apiEndpoint"
    upload-endpoint="http://localhost:5008/api/uploads/images"
    :image-url-hint="editDialog.imageHint"
    :sort-Order="editDialog.item?.sortOrder"
    :neu="editDialog.item?.neu"
    @item-edited="editDialog.onEdited"
  />

  <deleteDialogAll
    v-model="deleteDialog.show"
    :dialog-title="deleteDialog.title"
    :api-endpoint="deleteDialog.apiEndpoint"
    @items-deleted="deleteDialog.onDeleted"
    :category-id="deleteDialog.categoryId"
  />
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import createDialogAll from "./createDialogAll.vue";
import editDialogAll from "./editDialogAll.vue";
import deleteDialogAll from "./deleteDialogAll.vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api from "src/boot/axios";
import type { Category } from "../types/Category";
import type { CategoryItem } from "../types/CategoryItem";
import Sortable from "sortablejs";

const uploadProgress = ref(0);
const isUploading = ref(false);
const { logAudit, getCurrentUsername } = useAuditLogger();
const currentUser = getCurrentUsername();
const $q = useQuasar();
const selectedCategoriesForDeletion = ref<number[]>([]);
const selectAllItems = () => {
  if (selectedCategoriesForDeletion.value.length === categories.value.length) {
    selectedCategoriesForDeletion.value = [];
  } else {
    selectedCategoriesForDeletion.value = categories.value.map(
      (item) => item.id
    );
  }
};

// Tabs sortieren
const tabsSortableInstance = ref<Sortable | null>(null);

const initializeTabsSortable = () => {
  const tabsContainer = document.querySelector(
    ".q-tabs__content"
  ) as HTMLElement;
  if (tabsContainer && !tabsSortableInstance.value) {
    tabsSortableInstance.value = new Sortable(tabsContainer, {
      animation: 150,
      handle: ".q-tab",
      fallbackOnBody: true,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",

      forceFallback: false,
      fallbackTolerance: 3,
      touchStartThreshold: 5,
      delay: 100,

      delayOnTouchOnly: true,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEnd: (evt: any) => {
        if (evt.oldIndex !== evt.newIndex) {
          void updateCategoryOrder(evt.oldIndex, evt.newIndex);
        }
      },
    });
  }
};

const updateCategoryOrder = async (oldIndex: number, newIndex: number) => {
  const updatedCategories = [...categories.value];
  const [movedCategory] = updatedCategories.splice(oldIndex, 1);
  updatedCategories.splice(newIndex, 0, movedCategory!);

  categories.value = updatedCategories;

  try {
    const updatePromises = updatedCategories.map((category, index) =>
      api.put(`/api/category/${category.id}`, {
        ...category,
        sortOrder: index,
      })
    );

    await Promise.all(updatePromises);

    $q.notify({
      type: "positive",
      position: "top",
      message: "Kategorie-Reihenfolge erfolgreich aktualisiert",
    });
  } catch (error) {
    console.error("Error updating category order:", error);
    await fetchCategories();
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Aktualisieren der Kategorie-Reihenfolge",
    });
  }
};

// Items sortieren
const sortableInstances = ref<Record<string, Sortable>>({});
const initializeSortable = () => {
  categories.value.forEach((category) => {
    const container = document.getElementById(`sortable-${category.id}`);
    if (container && !sortableInstances.value[category.id]) {
      sortableInstances.value[category.id] = new Sortable(container, {
        animation: 150,
        handle: ".drag-handle",
        fallbackOnBody: true,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",

        forceFallback: false,
        fallbackTolerance: 3,
        touchStartThreshold: 5,
        delay: 100,

        delayOnTouchOnly: true,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEnd: (evt: any) => {
          if (evt.oldIndex !== evt.newIndex) {
            void updateItemOrder(
              category.id,
              category.name,
              evt.oldIndex,
              evt.newIndex
            );
          }
        },
      });
    }
  });
};

const updateItemOrder = async (
  categoryId: number,
  categoryName: string,
  oldIndex: number,
  newIndex: number
) => {
  const items = [...getCategoryItems(categoryName)];
  const [movedItem] = items.splice(oldIndex, 1);
  items.splice(newIndex, 0, movedItem!);

  categoryItems.value[categoryName] = items;

  try {
    const updatePromises = items.map((item, index) =>
      api.put(`/api/categoryItems/${item.id}`, { ...item, sortOrder: index })
    );

    await Promise.all(updatePromises);

    $q.notify({
      type: "positive",
      position: "top",
      message: "Reihenfolge erfolgreich aktualisiert",
    });
  } catch (error) {
    console.error("Error updating item order:", error);
    await fetchCategoryItems(categoryName);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Aktualisieren der Reihenfolge",
    });
  }
};

const categories = ref<Category[]>([]);

const showCategoryDialog = ref(false);
const showCategoryDeleteDialog = ref(false);
const categoryLoading = ref(false);
const bannerFile = ref<File | null>(null);
const bannerPreview = ref<string>("");

const uploadBannerImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file, file.name);

  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    const response = await api.post("/api/uploads/images", formData, {
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

    if (result.filename) {
      return `/uploads/images/${result.filename}`;
    }
    if (result.url && result.url.includes("/uploads/images/")) {
      return result.url;
    }

    throw new Error("Ungültige Antwort vom Upload-Server");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Upload fehlgeschlagen: ${errorMessage}`);
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

interface NewCategory {
  name: string;
  icon: string;
  apiEndpoint: string;
  bannerImage: string;
}

const newCategory = ref<NewCategory>({
  name: "",
  icon: "",
  apiEndpoint: "",
  bannerImage: "",
});

const iconOptions = [
  { label: "Pizza", value: "local_pizza" },
  { label: "Fastfood", value: "fastfood" },
  { label: "Getränke", value: "wine_bar" },
  { label: "Saucen", value: "water_drop" },
  { label: "Desserts", value: "cake" },
  { label: "Salat", value: "eco" },
  { label: "Fleisch", value: "restaurant" },
  { label: "Fisch", value: "set_meal" },
  { label: "Pasta", value: "ramen_dining" },
  { label: "Suppe", value: "soup_kitchen" },
  { label: "Brot", value: "bakery_dining" },
  { label: "Kaffee", value: "local_cafe" },
  { label: "Eis", value: "icecream" },
  { label: "Burger", value: "lunch_dining" },
  { label: "Asiatisch", value: "rice_bowl" },
  { label: "Teller", value: "local_dining" },
  { label: "Tasse", value: "coffee_maker" },
  { label: "Essen", value: "food_bank" },
  { label: "Flasche", value: "local_drink" },
];

const isCategoryFormValid = computed(() => {
  return (
    newCategory.value.name.trim() !== "" &&
    newCategory.value.icon !== "" &&
    !isUploading.value
  );
});
const onBannerFileChange = async (file: File | null) => {
  if (!file) {
    bannerPreview.value = "";
    newCategory.value.bannerImage = "";
    bannerFile.value = null;
    return;
  }

  bannerFile.value = null;

  const reader = new FileReader();
  reader.onload = (e) => (bannerPreview.value = e.target?.result as string);
  reader.readAsDataURL(file);

  try {
    newCategory.value.bannerImage = await uploadBannerImage(file);

    $q.notify({
      type: "positive",
      position: "top",

      message: "Bannerbild erfolgreich hochgeladen",
    });
  } catch (error) {
    console.error("Fehler beim Upload:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Hochladen des Bannerbildes",
    });
    newCategory.value.bannerImage = "";
    bannerPreview.value = "";
  }
};

const categoryItems = ref<Record<string, CategoryItem[]>>({});

const fetchCategories = async () => {
  try {
    const response = await api.get("/api/category");
    categories.value = response.data;
    categories.value.sort((a, b) => {
      return a.sortOrder >= b.sortOrder ? 1 : -1;
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Laden der Kategorien",
    });
  }
};

const isDeleting = ref(false);
const deleteCategory = async () => {
  if (selectedCategoriesForDeletion.value.length === 0) {
    return;
  }

  isDeleting.value = true;

  try {
    const itemsToDelete = categories.value.filter((category) =>
      selectedCategoriesForDeletion.value.includes(category.id)
    );

    const deletePromises = itemsToDelete.map(async (category) => {
      try {
        const itemResponse = await api.delete(`/api/category/${category.id}`);

        if (itemResponse.status === 200 && category.bannerImage) {
          const imageFileName = category.bannerImage.split("/").pop();
          if (imageFileName) {
            try {
              await api.delete(`/api/uploads/images/${imageFileName}`);
            } catch (imageError) {
              console.warn(
                `Fehler beim Löschen des Bildes für Category ${category.id}:`,
                imageError
              );
            }
          }
        }

        await logAudit("delete", "category", category.id, {
          name: category.name,
          icon: category.icon,
          username: currentUser,
          bannerImage: category.bannerImage,
          message: `Kategorie "${category.name}" wurde aus Kategorien gelöscht.`,
        });

        return { ok: true, categoryId: category.id };
      } catch (error) {
        console.error(
          `Fehler beim Löschen von Category ${category.id}:`,
          error
        );
        return { ok: false, categoryId: category.id };
      }
    });

    const results = await Promise.all(deletePromises);

    const successCount = results.filter((result) => result.ok).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      $q.notify({
        type: "positive",
        position: "top",
        message: `${successCount} Kategorie(n) erfolgreich gelöscht`,
      });
    }

    if (failCount > 0) {
      $q.notify({
        type: "negative",
        position: "top",
        message: `Fehler beim Löschen von ${failCount} Kategorie(n)`,
      });
    }

    selectedCategoriesForDeletion.value = [];
  } catch (error) {
    console.error("Fehler beim Löschvorgang:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Löschvorgang",
    });
  } finally {
    isDeleting.value = false;
    showCategoryDeleteDialog.value = false;
    await fetchCategories();
  }
};

const onSubmitCategory = async () => {
  if (!isCategoryFormValid.value) return;

  categoryLoading.value = true;
  try {
    const response = await api.post("/api/category", newCategory.value);

    const createdCategory = response.data;

    categories.value.push(createdCategory);
    if (createdCategory.name) {
      categoryItems.value[createdCategory.name] = [];
    }

    await logAudit("create", "category", createdCategory.id, {
      name: createdCategory.name,
      username: currentUser,
      icon: createdCategory.icon,
      bannerImage: createdCategory.bannerImage,
      message: `Kategorie "${createdCategory.name}" wurde in Kategorien erstellt.`,
    });

    newCategory.value = {
      name: "",
      icon: "",
      apiEndpoint: "",
      bannerImage: "",
    };
    bannerPreview.value = "";

    $q.notify({
      type: "positive",
      position: "top",
      message: "Kategorie erfolgreich erstellt!",
    });

    showCategoryDialog.value = false;
  } catch (error) {
    console.error("Error creating category:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Erstellen der Kategorie",
    });
  } finally {
    categoryLoading.value = false;
  }
};

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

const getCategoryItems = (categoryName: string): CategoryItem[] => {
  return categoryItems.value[categoryName] || [];
};

const createDialog = ref({
  show: false,
  title: "",
  buttonText: "",
  categoryId: 0,
  imageHint: "",
  onCreated: () => Promise.resolve(),
});

const editDialog = ref({
  show: false,
  item: null as CategoryItem | null,
  title: "",
  apiEndpoint: "",
  imageHint: "",
  onEdited: () => Promise.resolve(),
});

const deleteDialog = ref({
  show: false,
  title: "",
  apiEndpoint: "",
  categoryId: 0,
  onDeleted: () => Promise.resolve(),
});

const openCreateDialogAll = (categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) {
    console.warn(`Category "${categoryName}" not found`);
    return;
  }
  createDialog.value = {
    show: true,
    title: `Neues ${categoryName} erstellen`,
    buttonText: `${categoryName} erstellen`,
    categoryId: category.id,
    imageHint: `z.B. uploads/images/example.jpg`,
    onCreated: async () => {
      await fetchCategoryItems(categoryName);
    },
  };
};

const openEditDialog = (item: CategoryItem, categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) {
    console.warn(`Category "${categoryName}" not found`);
    return;
  }
  editDialog.value = {
    show: true,
    item: item,
    title: categoryName,
    apiEndpoint: category.apiEndpoint,
    imageHint: `z.B. ${category.apiEndpoint.replace("api", "images")}/example.jpg`,
    onEdited: async () => {
      await fetchCategoryItems(categoryName);
      editDialog.value.item = null;
    },
  };
};

const openDeleteDialog = (categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) {
    console.warn(`Category "${categoryName}" not found`);
    return;
  }
  deleteDialog.value = {
    show: true,
    title: categoryName,
    apiEndpoint: category.apiEndpoint,
    categoryId: category.id,
    onDeleted: async () => {
      await fetchCategoryItems(categoryName);
    },
  };
};

const fetchCategoryItems = async (categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) {
    console.warn(`Category "${categoryName}" not found`);
    return;
  }

  try {
    const response = await api.get(
      `/api/categoryItems/by-category/${category.id}`
    );
    categoryItems.value[categoryName] = response.data;
    categoryItems.value[categoryName]!.sort((a, b) => {
      return a.sortOrder >= b.sortOrder ? 1 : -1;
    });
  } catch (error) {
    console.error(`Error fetching ${categoryName}:`, error);
    $q.notify({
      type: "negative",
      position: "top",
      message: `Fehler beim Laden der ${categoryName}`,
    });
  }
};

const tab = ref("");
const isUserScrolling = ref(false);
const sectionRefs = ref<Record<string, HTMLElement>>({});

const setSectionRef = (
  categoryName: string,
  el: Element | ComponentPublicInstance | null
) => {
  if (el && el instanceof HTMLElement) {
    sectionRefs.value[categoryName] = el;
  }
};

const onTabChange = () => {
  isUserScrolling.value = true;

  const headerOffset = 160;
  const element = sectionRefs.value[tab.value];

  if (element) {
    const elementTop = element.offsetTop;
    const scrollTop = elementTop - headerOffset;

    window.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: "smooth",
    });
  }

  setTimeout(() => {
    isUserScrolling.value = false;
  }, 1000);
};

let observer: IntersectionObserver | null = null;

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (isUserScrolling.value) return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const categoryName = Object.keys(sectionRefs.value).find(
        (key) => sectionRefs.value[key] === entry.target
      );
      if (categoryName) {
        tab.value = categoryName;
      }
    }
  });
};

onMounted(async () => {
  await fetchCategories();
  for (const category of categories.value) {
    await fetchCategoryItems(category.name);
  }
  await nextTick();

  initializeSortable();
  initializeTabsSortable();
  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  Object.values(sectionRefs.value).forEach((section) => {
    if (section) observer?.observe(section);
  });
});

onBeforeUnmount(() => {
  if (observer) {
    Object.values(sectionRefs.value).forEach((section) => {
      if (section) observer?.unobserve(section);
    });
  }
});
</script>

<style scoped>
.q-tab {
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.q-tab:active {
  cursor: grabbing;
}

.sortable-ghost {
  opacity: 0.5;
  background-color: #f0f0f0;
}

.sortable-chosen {
  transform: scale(1.02);
}

.sortable-drag {
  transform: rotate(0deg);
  opacity: 0.8;
}
.drag-handle {
  cursor: grab;
  display: flex;
  align-items: center;
  margin-left: -10px;
  margin-right: 10px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  padding: 8px;
  margin: -8px 2px -8px -18px;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle2 {
  cursor: grab;
  display: flex;
  margin-left: -0.5px;
  margin-right: 0.5px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.drag-handle2:active {
  cursor: grabbing;
}

.sortable-container {
  min-height: 50px;
  touch-action: pan-y;
}

.sortable-item {
  transition: transform 0.2s ease;
  touch-action: none;
}

.bannerHeight {
  height: 180px;
}

.tabsBorder {
  position: sticky;
  top: 0;
  border: 1px ridge #ebebeb;
}

.sticky-tabs {
  position: sticky;
  top: 52px;
  z-index: 5;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.my-card {
  background-color: rgb(230, 230, 230);
  max-width: 100%;
  padding: 0.5%;
  text-align: center;
  box-shadow: 1px 4px 0.2rem rgb(105, 105, 105);
  border: 1px solid rgb(88, 88, 88);
  overflow: hidden;
  height: auto;
}

.card-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-section3 {
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-shadow: 2px 2px 0.4rem rgb(78, 78, 85);
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(119, 119, 119);
}
.imgGericht {
  border-radius: 6px;
  aspect-ratio: 1;
  max-width: 80px;
  width: 80px;
  min-width: 80px;
  height: auto;
  box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
  border: 1px solid rgb(204, 204, 204);
}

.text-container {
  flex-grow: 1;
  padding-left: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  flex-shrink: 1;
  min-height: 50px;
}

.description {
  font-size: 0.9em;
  color: #666;
  margin-top: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  float: right;
  justify-content: space-between;
}

.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.tab-section-name {
  border: 1px solid;
  box-shadow: 2px 2px 0.4rem rgb(0, 0, 0);
}

.selected-for-deletion {
  border-color: #f44336 !important;
  background-color: #ffebee !important;
}
.above {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

@media (max-width: 600px) {
  .q-tab {
    min-width: 80px;
    padding: 8px 12px;
  }
  .drag-handle {
    padding: 12px;
    margin: -12px 2px -12px -22px;
  }

  .drag-handle .q-icon {
    font-size: 24px !important;
  }
  .bannerHeight {
    height: 120px;
  }
  .text-container h6 {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
  }
  .description {
    font-size: 12px;
    width: 98%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .nowrap {
    white-space: nowrap;
  }
  .my-card {
    height: auto;
  }
  .imgGericht {
    min-width: 60px;
    margin-left: -10px;
  }
  .card-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: auto;
    top: 0;
  }
  .card-section3 {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
  }
  .preisText {
    font-size: 12px;
  }

  .above {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: ROW;
    height: 45px;
  }

  .banner {
    max-height: 10px;
  }
  .bannerText {
    font-size: 12px;
  }
  .bannerIcon {
    font-size: 20px;
  }
}
</style>
