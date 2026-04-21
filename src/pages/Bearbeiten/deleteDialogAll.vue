<template>
  <q-dialog v-model="deleteDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card class="premium-glass-card shadow-24 custom-dialog-width">
      <q-card-section class="q-pa-none relative-position">
        <q-btn 
          icon="close" 
          flat 
          round 
          dense 
          class="absolute-top-right q-ma-md text-white z-top" 
          @click="closeDeleteDialog" 
        />

        <div class="card-inner">
          <div class="text-center q-mb-xl">
            <div class="text-overline text-negative text-weight-bold tracking-widest">GEFAHRENZONE</div>
            <div class="text-h5 text-white text-weight-light uppercase">
              <q-icon name="delete" class="q-mr-sm" />
              {{ dialogTitle }} löschen
            </div>
          </div>

          <div v-if="items.length > 0" class="row justify-between items-center q-mb-md">
            <div class="text-caption text-grey-5 uppercase tracking-wider">Einträge auswählen</div>
            <q-btn
              flat
              size="sm"
              color="secondary"
              class="luxury-btn-outline q-px-md"
              @click="selectAllItems"
              :label="selectedItemsForDeletion.length === items.length ? 'Alle abwählen' : 'Alle auswählen'"
            />
          </div>

          <div v-if="items.length === 0" class="text-center text-grey-6 q-pa-xl">
            Keine {{ dialogTitle }} verfügbar
          </div>

          <div
            v-else
            class="scroll-container q-gutter-y-sm"
            style="max-height: 46vh; overflow-y: auto"
          >
            <div
              v-for="item in items"
              :key="item.id"
              class="premium-glass-card-inner q-pa-sm transition-all"
              :class="{ 'selected-item-active': selectedItemsForDeletion.includes(item.id) }"
            >
              <div class="row items-center no-wrap" style="gap: 15px">
                <div class="image-wrapper shadow-2">
                  <q-img
                    v-if="item.img && !imageErrors[item.id]"
                    :src="getFullImageUrl(item.img)"
                    :alt="item.name"
                    style="height: 60px; width: 60px"
                    class="rounded-borders"
                    @error="handleImageError(item.id)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center bg-grey-9 rounded-borders"
                    style="height: 60px; width: 60px"
                  >
                    <q-icon name="image" size="24px" color="grey-7" />
                  </div>
                </div>

                <div class="col">
                  <div class="text-subtitle1 text-white text-weight-medium line-clamp-1">
                    {{ item.name }}
                    <q-chip color="secondary" text-color="white" dense v-if="item.neu" label="Neu" size="xs" />
                  </div>
                  <div class="text-caption text-grey-5 line-clamp-1">{{ item.description }}</div>
                  <div class="text-caption text-secondary text-weight-bold">
                    ab {{ item.price.toFixed(2) }}€
                  </div>
                </div>

                <q-checkbox
                  v-model="selectedItemsForDeletion"
                  :val="item.id"
                  color="negative"
                  dark
                />
              </div>
            </div>
          </div>

          <div
            v-if="selectedItemsForDeletion.length > 0"
            class="q-mt-lg q-pa-md warning-banner row items-center no-wrap"
          >
            <q-icon name="warning" color="negative" size="sm" class="q-mr-sm" />
            <div class="text-caption text-white">
              <span class="text-weight-bold text-negative">{{ selectedItemsForDeletion.length }}</span> {{ dialogTitle }} werden unwiderruflich gelöscht.
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12 col-sm-6">
              <q-btn 
                flat 
                label="Abbrechen" 
                color="white" 
                class="luxury-btn-outline full-width" 
                @click="closeDeleteDialog" 
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn 
                label="Löschen" 
                color="negative" 
                class="luxury-btn full-width"
                icon="delete_forever"
                :disable="selectedItemsForDeletion.length === 0"
                :loading="isDeleting"
                @click="deleteItems" 
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, ref, watch } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api, { getBaseURL } from "src/boot/axios";
import type { CategoryItem } from "../types/CategoryItem";
const { logAudit, getCurrentUsername } = useAuditLogger();

const $q = useQuasar();
const items = ref<CategoryItem[]>([]);
const isDeleting = ref(false);
const selectedItemsForDeletion = ref<number[]>([]);

const props = defineProps<{
  modelValue: boolean;
  dialogTitle: string;
  apiEndpoint: string;
  categoryId: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "items-deleted": [];
}>();

const deleteDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
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

watch(deleteDialog, (newValue) => {
  if (newValue) {
    void fetchItems();
  }
});

const fetchItems = async () => {
  try {
    const response = await api.get(
      `/api/categoryitems/by-category/${props.categoryId}`
    );
    items.value = response.data;
    items.value.sort((a, b) => {
      return a.sortOrder >= b.sortOrder ? 1 : -1;
    });
    imageErrors.value = {};
  } catch (error) {
    console.error("Error fetching items:", error);
    $q.notify({
      type: "negative",
      position: "top",

      message: `Fehler beim Laden der ${props.dialogTitle}`,
    });
  }
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  selectedItemsForDeletion.value = [];
  imageErrors.value = {};
};

const selectAllItems = () => {
  if (selectedItemsForDeletion.value.length === items.value.length) {
    selectedItemsForDeletion.value = [];
  } else {
    selectedItemsForDeletion.value = items.value.map((item) => item.id);
  }
};

const deleteItems = async () => {
  if (selectedItemsForDeletion.value.length === 0) {
    return;
  }

  isDeleting.value = true;

  try {
    const itemsToDelete = items.value.filter((item) =>
      selectedItemsForDeletion.value.includes(item.id)
    );

    const deletePromises = itemsToDelete.map(async (item) => {
      try {
        const itemResponse = await api.delete(`/api/categoryitems/${item.id}`);

        if (itemResponse.status === 200 && item.img) {
          const imageFileName = item.img.split("/").pop();
          if (imageFileName) {
            try {
              await api.delete(`/api/uploads/images/${imageFileName}`);
            } catch (imageError) {
              console.warn(
                `Fehler beim Löschen des Bildes für Item ${item.id}:`,
                imageError
              );
            }
          }
        }

        const categoryName = await getCategoryNameById(props.categoryId);
        const currentUser = getCurrentUsername();

        await logAudit("delete", "categoryItem", item.id, {
          name: item.name,
          price: item.price,
          description: item.description,
          img: item.img,
          message: `Item "${item.name}" wurde aus der Kategorie "${categoryName}" gelöscht`,
          username: currentUser,
        });

        return { ok: true, itemId: item.id };
      } catch (error) {
        console.error(`Fehler beim Löschen von Item ${item.id}:`, error);
        return { ok: false, itemId: item.id };
      }
    });

    const results = await Promise.all(deletePromises);
    const successfulDeletions = results.filter((result) => result.ok);
    const failedDeletions = results.filter((result) => !result.ok);

    const successfulIds = successfulDeletions.map((r) => r.itemId);
    items.value = items.value.filter(
      (item) => !successfulIds.includes(item.id)
    );

    if (failedDeletions.length === 0) {
      $q.notify({
        type: "positive",
        position: "top",

        message: `${selectedItemsForDeletion.value.length} ${props.dialogTitle} erfolgreich gelöscht!`,
      });
      emit("items-deleted");
    } else {
      $q.notify({
        type: "warning",
        position: "top",

        message: `${successfulDeletions.length} von ${results.length} ${props.dialogTitle} gelöscht. Einige Löschvorgänge sind fehlgeschlagen.`,
      });
    }

    closeDeleteDialog();
  } catch (error) {
    console.error("Error deleting items:", error);
    $q.notify({
      type: "negative",
      position: "top",

      message: `Fehler beim Löschen der ${props.dialogTitle}`,
    });
  } finally {
    isDeleting.value = false;
  }
};

const imageErrors = ref<Record<number, boolean>>({});

const handleImageError = (itemId: number) => {
  imageErrors.value[itemId] = true;
};

const getCategoryNameById = async (categoryId: number): Promise<string> => {
  try {
    const response = await api.get(`/api/category/${categoryId}`);
    return response.data.name;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorie:", error);
    return "Unbekannte Kategorie";
  }
};
</script>

<style scoped>
.premium-glass-card {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
}

.custom-dialog-width {
  width: 700px;
  max-width: 95vw;
}

.card-inner {
  padding: 40px 30px;
}

.premium-glass-card-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.selected-item-active {
  background: rgba(244, 67, 54, 0.1);
  border-color: rgba(244, 67, 54, 0.5);
}

.image-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.2);
}

.luxury-btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  height: 55px;
  color: white;
}

.warning-banner {
  background: rgba(244, 67, 54, 0.08);
  border-radius: 12px;
  border-left: 4px solid #f44336;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>