<template>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card style="min-width: 350px; width: 800px">
      <q-card-section class="text-center">
        <div class="text-h6 text-negative">
          <q-icon name="delete" class="q-mr-sm" />
          {{ dialogTitle }} löschen
        </div>
        <div class="text-caption q-mb-md">
          Wählen Sie die {{ dialogTitle }}, die Sie löschen möchten:
        </div>

        <div v-if="items.length === 0" class="text-center text-grey-6">
          Keine {{ dialogTitle }} verfügbar
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
                selectedItemsForDeletion.length === items.length
                  ? 'Alle abwählen'
                  : 'Alle auswählen'
              "
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-card
          v-for="item in items"
          :key="item.id"
          class="item-delete-item q-mt-sm"
          :class="{
            'selected-for-deletion': selectedItemsForDeletion.includes(item.id),
          }"
        >
          <q-card-section class="row items-center no-wrap" style="gap: 5px">
            <q-card style="height: 61px; width: 61px">
              <q-img
                v-if="item.img && !imageErrors[item.id]"
                :src="getFullImageUrl(item.img)"
                :alt="item.name"
                style="height: 60px; width: 60px"
                class="rounded-borders q-mr-md"
                @error="handleImageError(item.id)"
              />
              <div
                v-else
                class="flex items-center justify-center"
                style="height: 60px; width: 60px; background-color: #f5f5f5"
              >
                <q-icon name="image" size="24px" color="grey-5" />
              </div>
            </q-card>

            <div class="col">
              <div class="text-subtitle1 text-weight-medium">
                {{ item.name }}
                <q-chip color="info" v-if="item.neu == true" label="Neu" />
              </div>
              <div class="text-body2 text-grey-7">{{ item.description }}</div>
              <div class="text-caption text-primary">
                ab {{ item.price.toFixed(2) }}€
              </div>
            </div>
            <q-checkbox
              v-model="selectedItemsForDeletion"
              :val="item.id"
              color="negative"
              class="q-mr-md"
            />
          </q-card-section>
        </q-card>

        <div
          v-if="selectedItemsForDeletion.length > 0"
          class="q-mt-md text-negative"
        >
          <q-icon name="warning" class="q-mr-xs" />
          {{ selectedItemsForDeletion.length }} {{ dialogTitle }} werden
          gelöscht. Diese Aktion kann nicht rückgängig gemacht werden!
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Abbrechen" @click="closeDeleteDialog" />
        <q-btn
          label="Löschen"
          color="negative"
          :disable="selectedItemsForDeletion.length === 0"
          :loading="isDeleting"
          @click="deleteItems"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { computed, ref, watch } from "vue";
import { useAuditLogger } from "src/composables/useAuditLogger";
import api from "src/boot/axios";
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
.item-delete-item {
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.item-delete-item:hover {
  background-color: #f5f5f5;
}

.selected-for-deletion {
  border-color: #f44336 !important;
  background-color: #ffebee !important;
}
</style>
