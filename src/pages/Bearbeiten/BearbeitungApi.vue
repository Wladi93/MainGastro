<template>
  <div class="app-container">

    <div class="glass-header">
      <div
        v-if="lieferzeit.length"
        class="row justify-between items-center q-px-md q-pt-md"
      >
        <div class="row items-center">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder">SPEISEKARTE EDIT</span>
<q-icon name="edit" class="q-ml-sm" size="sm"/>
        </div>

        <div class="delivery-pill row items-center" v-for="Lieferzeit in lieferzeit" :key="Lieferzeit.id">
                    <q-btn
            icon="settings"
            flat
            round
            dense
            size="sm"
            color="grey-4"
            class="q-mr-sm"
            @click="openLieferzeitDialog"
          />
          <q-icon name="moped" size="xs" class="q-mr-xs" color="secondary" />
          {{ anzeigeLieferzeit }}
        </div>
      </div>

      <div class="q-px-md q-py-md row q-gutter-sm">
        <q-btn
          label="Tab +"
          class="admin-btn col"
          no-caps
          unelevated
          icon="dashboard_customize"
          @click="showCategoryDialog = true"
        />
        <q-btn
          label="Tab -"
          class="admin-btn col"
          no-caps
          unelevated
          color="negative"
          icon="delete"
          @click="showCategoryDeleteDialog = true"
        />
      </div>

      <div ref="navContainerRef" class="categories-nav q-pl-md q-pb-md" id="categories-nav-sortable">
        <div
          v-for="category in categories"
          :key="category.sortOrder"
          class="nav-pill"
          :class="{ 'pill-active': tab === category.name }"
          @mousedown="onPillMouseDown"
          @click="onPillClick(category)"
        >
          <q-icon name="drag_indicator" size="12px" class="q-mr-xs pill-drag-icon" />
         
          {{ category.name }}
        </div>
      </div>
    </div>

    <div class="content-scrollable">
      <div
        v-for="category in categories"
        :key="category.apiEndpoint"
        v-show="true"
        :ref="(el: any) => setSectionRef(category.name, el)"
        class="category-block"
      >
        <div class="category-hero">
          <q-img
            :src="getFullImageUrl(category.bannerImage)"
            spinner-color="white"
            :alt="`${category.name} Banner`"
            class="hero-img"
          >
            <div class="hero-overlay full-width full-height flex items-end">
              <div class="q-pa-lg full-width row justify-between items-end">
                <div>
                  <div class="text-overline text-secondary text-weight-bold">KATEGORIE</div>
                  <div class="text-h4 text-white text-weight-bolder">
                    <q-icon :name="category.icon" color="secondary" size="xs" class="q-mr-xs" />
                    {{ category.name }}
                  </div>
                </div>
                <div class="q-gutter-sm">
                  <!-- NEU: Banner-Bild ändern Button -->
                  <q-btn
                    round
                    color="primary"
                    icon="image"
                    size="sm"
                    :loading="bannerEditLoadingId === category.id"
                    @click="triggerBannerEdit(category)"
                  >
                    <q-tooltip>Bannerbild ändern</q-tooltip>
                  </q-btn>
                  <q-btn
                    round
                    color="secondary"
                    icon="post_add"
                    size="sm"
                    @click="openCreateDialogAll(category.name)"
                  />
                  <q-btn
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="openDeleteDialog(category.name)"
                  />
                </div>
              </div>
            </div>
          </q-img>
        </div>

        <div
          :id="`sortable-${category.id}`"
          class="items-container q-px-md"
          :data-category-id="category.id"
          :data-category-name="category.name"
        >
          <div
            v-for="item in getCategoryItems(category.name)"
            :key="item.id"
            class="premium-glass-card"
          >
            <div class="card-inner">
              <div class="drag-handle flex flex-center q-pr-sm">
                <q-icon name="drag_indicator" color="grey-7" size="sm" />
              </div>

              <div class="card-body">
                <div class="text-subtitle1 text-white text-weight-bold flex items-center">
                  {{ item.name }}
                  <q-chip
                    v-if="item.neu == true"
                    class="bg-secondary text-white q-ml-sm"
                    
                    label="Neu"
                    :text-color="schriftFarbe ? 'white' : 'black'"
                  />
                </div>
                <p class="card-desc">{{ item.description }}</p>
                <div class="price-box">
                  {{ item.price ? item.price.toFixed(2) : "0.00" }}
                  <span class="currency">€</span>
                </div>
              </div>

              <div class="card-media">
                <q-img
                  v-if="item.img"
                  :src="getFullImageUrl(item.img)"
                  :alt="item.name"
                  class="item-img shadow-10"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-10">
                      <q-icon name="restaurant" color="grey-8" />
                    </div>
                  </template>
                </q-img>
                <q-btn
                  round
                  unelevated
                  color="secondary"
                  :text-color="schriftFarbe ? 'white' : 'black'"
                  icon="edit"
                  size="sm"
                  class="add-btn-over"
                  @click="() => openEditDialog(item, category.name)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input
      ref="bannerEditInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onEditBannerFileChange"
    />

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

    <q-dialog v-model="showCategoryDeleteDialog" persistent>
      <q-card style="min-width: 350px; width: 800px">
        <q-card-section class="text-center">
          <div class="text-h6 text-negative">
            <q-icon name="delete" class="q-mr-sm" />
            Kategorien löschen
          </div>
          <div class="text-caption q-mb-md">
            Wählen Sie die Kategorien, die Sie löschen möchten:
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
      :has-beilagen="editDialog.item?.hasBeilagen"
      :allergene-ids="editDialog.item?.allergeneIds"
      :zusatzstoffe-ids="editDialog.item?.zusatzstoffeIds"
      @item-edited="editDialog.onEdited"
      :has-saucen="editDialog.item?.hasSaucen"
      :saucen-ids="editDialog.item?.saucenIds"
    />

    <deleteDialogAll
      v-model="deleteDialog.show"
      :dialog-title="deleteDialog.title"
      :api-endpoint="deleteDialog.apiEndpoint"
      @items-deleted="deleteDialog.onDeleted"
      :category-id="deleteDialog.categoryId"
    />

    <LieferzeitSettings
      v-model:lieferzeit="lieferzeit"
      v-model:isOpen="lieferzeitOpen"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import createDialogAll from "./createDialogAll.vue";
import editDialogAll from "./editDialogAll.vue";
import deleteDialogAll from "./deleteDialogAll.vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api, { getBaseURL } from "src/boot/axios";
import type { Category } from "../types/Category";
import type { CategoryItem } from "../types/CategoryItem";
import Sortable, { type SortableEvent } from "sortablejs";
import type { Lieferzeit } from "../types/LieferzeitType";
import LieferzeitSettings from "src/components/LieferzeitSettings.vue";

const lieferzeitOpen = ref(false);
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

const openLieferzeitDialog = () => {
  lieferzeitOpen.value = true;
};

const lieferzeit = ref<Lieferzeit[]>([]);

async function loadLieferzeit() {
  try {
    const response = await api.get(`/api/lieferzeit`);
    lieferzeit.value = response.data;
  } catch (error) {
    console.error("Lieferzeit konnte nicht geladen werden", error);
  }
}

const anzeigeLieferzeit = computed(() => {
  const teile = [];
  if (lieferzeit.value[0]!.stunden > 0) {
    teile.push(lieferzeit.value[0]!.stunden + "h");
  }
  if (lieferzeit.value[0]!.minuten > 0) {
    teile.push(lieferzeit.value[0]!.minuten + "min");
  }
  return teile.length > 0 ? teile.join(" ") : "0min";
});

const tabsSortableInstance = ref<Sortable | null>(null);

const initializeTabsSortable = () => {
  const tabsContainer = document.getElementById(
    "categories-nav-sortable"
  ) as HTMLElement;
  if (tabsContainer && !tabsSortableInstance.value) {
    tabsSortableInstance.value = new Sortable(tabsContainer, {
      animation: 150,
      handle: ".nav-pill",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      forceFallback: false,
      fallbackOnBody: true,
      fallbackTolerance: 3,
      touchStartThreshold: 4,
      delay: 200,
      delayOnTouchOnly: true,
      scroll: true,
      scrollSensitivity: 80,
      scrollSpeed: 10,
      onStart: () => {
        document.body.style.overflow = "hidden";
      },
      onEnd: (evt: SortableEvent) => {
        document.body.style.overflow = "";
        pillDragged.value = true;
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
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

const sortableInstances = ref<Record<string, Sortable>>({});

const initializeSortable = () => {
  categories.value.forEach((category) => {
    const container = document.getElementById(`sortable-${category.id}`);
    if (container && !sortableInstances.value[category.id]) {
      sortableInstances.value[category.id] = new Sortable(container, {
        animation: 150,
        handle: ".drag-handle",
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        forceFallback: false,
        fallbackOnBody: true,
        fallbackTolerance: 3,
        touchStartThreshold: 4,
        delay: 200,
        delayOnTouchOnly: true,
        scroll: true,
        scrollSensitivity: 80,
        scrollSpeed: 10,
        onChoose: () => {
          if (navigator.vibrate) navigator.vibrate(30);
        },
        onStart: () => {
          document.body.style.overflow = "hidden";
        },
        onEnd: (evt: SortableEvent) => {
          document.body.style.overflow = "";
          if (evt.oldIndex !== undefined && evt.newIndex !== undefined && evt.oldIndex !== evt.newIndex) {
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
  // Bild clientseitig komprimieren
  const compressImage = (f: File, maxSizeMB = 4.5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(f);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const MAX_DIM = 1920;
        let { width, height } = img;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Canvas toBlob fehlgeschlagen"));

              if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
                resolve(
                  new File([blob], f.name.replace(/\.[^.]+$/, ".jpg"), {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  })
                );
              } else {
                quality = Math.max(quality - 0.1, 0.3);
                tryCompress();
              }
            },
            "image/jpeg",
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = url;
    });
  };

  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    const fileToUpload = await compressImage(file);

    const formData = new FormData();
    formData.append("image", fileToUpload, fileToUpload.name);

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


const bannerEditInput = ref<HTMLInputElement | null>(null);
const editingCategory = ref<Category | null>(null);
const bannerEditLoadingId = ref<number | null>(null);
const triggerBannerEdit = (category: Category) => {
  editingCategory.value = category;
  bannerEditInput.value?.click();
};

const onEditBannerFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file || !editingCategory.value) return;

  const targetCategory = editingCategory.value;
  bannerEditLoadingId.value = targetCategory.id;

  try {
    const newBannerUrl = await uploadBannerImage(file);

    await api.put(`/api/category/${targetCategory.id}`, {
      ...targetCategory,
      bannerImage: newBannerUrl,
    });

    if (targetCategory.bannerImage) {
      const oldFileName = targetCategory.bannerImage.split("/").pop();
      if (oldFileName) {
        try {
          await api.delete(`/api/uploads/images/${oldFileName}`);
        } catch (imgError) {
          console.warn("Altes Bannerbild konnte nicht gelöscht werden:", imgError);
        }
      }
    }

    const cat = categories.value.find((c) => c.id === targetCategory.id);
    if (cat) cat.bannerImage = newBannerUrl;

    await logAudit("update", "category", targetCategory.id, {
      name: targetCategory.name,
      username: currentUser,
      bannerImage: newBannerUrl,
      message: `Bannerbild der Kategorie "${targetCategory.name}" wurde geändert.`,
    });

    $q.notify({
      type: "positive",
      position: "top",
      message: `Bannerbild für "${targetCategory.name}" erfolgreich aktualisiert`,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Bannerbildes:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Aktualisieren des Bannerbildes",
    });
  } finally {
    bannerEditLoadingId.value = null;
    editingCategory.value = null;
    input.value = "";
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

  const apiBaseURL = getBaseURL();
  const normalizedBaseURL = apiBaseURL.endsWith("/")
    ? apiBaseURL
    : apiBaseURL + "/";
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
const pillDragged = ref(false);

const onPillMouseDown = () => {
  pillDragged.value = false;
};

const onPillClick = (category: Category) => {
  if (pillDragged.value) {
    pillDragged.value = false;
    return;
  }
  onTabChange(category);
};

const setSectionRef = (
  categoryName: string,
  el: Element | ComponentPublicInstance | null
) => {
  if (el && el instanceof HTMLElement) {
    sectionRefs.value[categoryName] = el;
  }
};

const onTabChange = (category: Category) => {
  tab.value = category.name;
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

const navContainerRef = ref<HTMLElement | null>(null);

  watch(tab, async () => {
  await nextTick(); 
  
  if (!navContainerRef.value) return;

  const activePill = navContainerRef.value.querySelector('.pill-active') as HTMLElement;
  
  if (activePill) {
    const containerWidth = navContainerRef.value.clientWidth;
    const pillLeft = activePill.offsetLeft;
    const pillWidth = activePill.clientWidth;
    const scrollPos = pillLeft - (containerWidth / 2) + (pillWidth / 2);

    navContainerRef.value.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  }
});

onMounted(async () => {
  await loadSchriftFarbe();
  await loadLieferzeit();
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
  if (tabsSortableInstance.value) {
    tabsSortableInstance.value.destroy();
    tabsSortableInstance.value = null;
  }
  Object.values(sortableInstances.value).forEach((instance) => {
    instance.destroy();
  });
  sortableInstances.value = {};
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  padding-top: 60px;
}

.glass-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.delivery-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  color: white;
}

.admin-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
}

.categories-nav {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scrollbar-width: none;
}
.categories-nav::-webkit-scrollbar {
  display: none;
}

.nav-pill {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  color: #777;
  font-weight: 600;
  cursor: grab;
  transition: 0.3s;
  border: 1px solid transparent;
  white-space: nowrap;
  font-size: 13px;
  user-select: none;
}
.nav-pill:active {
  cursor: grabbing;
}
.pill-drag-icon {
  opacity: 0.3;
  color: #aaa;
}
.pill-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: var(--q-secondary);
}

.content-scrollable {
  padding-bottom: 60px;
}

.category-block {
  margin-bottom: 50px;
}

.category-hero {
  height: 220px;
  margin-bottom: -40px;
  border-radius: 0 0 40px 40px;
  overflow: hidden;
}
.hero-img {
  height: 100%;
  width: 100%;
}
.hero-overlay {
  background: linear-gradient(to bottom, transparent 20%, #050505 100%);
}
.items-container {
  padding-top: 50px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  margin-bottom: 16px;
  transition: transform 0.3s;
}

.card-inner {
  display: flex;
  padding: 16px;
  gap: 12px;
}

.drag-handle {
  cursor: grab;
  opacity: 0.5;
}
.drag-handle:active {
  cursor: grabbing;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card-desc {
  color: #888;
  font-size: 13px;
  line-height: 1.4;
  margin: 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-box {
  margin-top: auto;
  font-size: 18px;
  font-weight: 800;
  color: var(--q-secondary);
}
.currency {
  font-size: 12px;
  opacity: 0.6;
}

.card-media {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
.item-img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.add-btn-over {
  position: absolute;
  bottom: -8px;
  right: -8px;
  border: 4px solid #0a0a0a;
}

.sortable-ghost {
  opacity: 0.4;
  border: 2px dashed var(--q-secondary) !important;
  background: transparent !important;
}
.sortable-chosen {
  opacity: 0.85;
  transform: scale(1.02);
}
.sortable-drag {
  opacity: 0.95 !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
}

.nav-pill,
.drag-handle,
.premium-glass-card {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.sortable-chosen .premium-glass-card,
.sortable-chosen.nav-pill {
  transform: scale(1.03);
  border-color: var(--q-secondary) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}

@media (min-width: 800px) {
  .items-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>