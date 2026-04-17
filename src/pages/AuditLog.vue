<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">User Logs</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Desktop Ansicht -->
        <q-table
          v-if="$q.screen.gt.sm"
          :rows="logs"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          dense
          bordered
          :sort-method="
            (rows, sortBy, descending) => {
              return [...rows].sort((a, b) => {
                const tA = new Date(a[sortBy]).getTime();
                const tB = new Date(b[sortBy]).getTime();
                return descending ? tB - tA : tA - tB;
              });
            }
          "
          :sort-by="'timestamp'"
          :sort-desc="true"
        >
          <template #body-cell-action="props">
            <q-td :props="props">
              <q-chip :color="getActionColor(props.row.action)">
                {{ props.row.action.toUpperCase() }}
              </q-chip>
            </q-td>
          </template>

          <template #body-cell-entity="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.entity === 'category' ? 'red-11' : 'green-11'"
              >
                {{ props.row.entity }}
              </q-chip>
            </q-td>
          </template>

          <template #body-cell-username="props">
            <q-td :props="props">
              <q-chip color="blue-12" class="text-white">
                {{ props.row.username }}</q-chip
              >
            </q-td>
          </template>
          <template #body-cell-details="props">
            <q-td>
              <q-btn
                dense
                flat
                color="primary"
                label="Details"
                @click="showDetails(props.row.changes)"
              />
            </q-td>
          </template>
        </q-table>

        <!-- Mobile Ansicht -->
        <div v-else>
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner size="2em" />
          </div>

          <div
            v-else-if="logs.length === 0"
            class="text-center q-pa-md text-grey-6"
          >
            Keine Einträge gefunden
          </div>

          <div>
            <q-list separator>
              <q-item
                v-for="log in paginatedLogs"
                :key="log.id"
                class="q-pa-md q-mt-sm"
                style="border: 1px solid grey; border-radius: 6px"
              >
                <q-item-section>
                  <q-item-label class="text-weight-medium q-mb-sm">
                    <div class="row q-gutter-xs">
                      <q-chip :color="getActionColor(log.action)">
                        {{ log.action.toUpperCase() }}
                      </q-chip>
                    </div>
                    <q-separator class="q-mt-sm" color="grey-3" size="3px" />
                  </q-item-label>

                  <q-item-label caption class="q-mb-sm">
                    <div class="row q-gutter-xs">
                      <q-chip
                        dense
                        color="blue-12"
                        text-color="white"
                        size="md"
                      >
                        {{ log.username }}
                      </q-chip>
                      <q-chip
                        dense
                        :color="
                          log.entity === 'category' ? 'red-11' : 'green-12'
                        "
                        text-color="white"
                        size="md"
                      >
                        {{ log.entity }}
                      </q-chip>
                    </div>
                  </q-item-label>

                  <q-item-label caption class="q-mt-xs">
                    <q-icon name="schedule" size="xs" class="q-mr-xs" />
                    {{ formatTimestamp(log.timestamp) }}
                  </q-item-label>

                  <q-item-label caption class="q-mt-xs" v-if="log.entityId">
                    <q-icon name="tag" size="md" class="q-mr-xs" />
                    ID: {{ log.entityId }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    round
                    flat
                    color="primary"
                    icon="info"
                    size="md"
                    @click="showDetails(log.changes)"
                  />
                </q-item-section>
              </q-item>
            </q-list>

            <!-- Pagination -->
            <div
              class="text-center q-mt-md"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div class="row items-center justify-center q-mt-md">
                <q-pagination
                  v-model="currentPage"
                  :max="totalPages"
                  max-pages="5"
                  boundary-numbers
                  direction-links
                  color="primary"
                  size="md"
                />
              </div>
            </div>
          </div>
          <div
            style="display: flex; justify-content: center; align-items: center"
            class="q-mt-lg full-width"
          >
            <q-select
              outlined
              class="full-width"
              v-model="rowsPerPage"
              :options="[5, 10, 15, 20, 50]"
              label="Pro Seite"
              label-color="primary"
              text-color="primary"
              color="primary"
              emit-value
              map-options
              style="width: 120px"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="detailsDialog">
      <q-card style="min-width: 400px; max-width: 96vw; max-height: 80vh">
        <q-card-section class="row items-center">
          <div class="text-h6">Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll" style="max-height: 60vh">
          <div v-if="parsedDetails">
            <!-- Message -->
            <div v-if="parsedDetails.message" class="q-mb-md">
              <q-banner
                class="bg-blue-grey-13 text-white"
                style="border-radius: 5px"
              >
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                {{ parsedDetails.message }}
              </q-banner>
            </div>

            <!-- Username -->
            <div v-if="parsedDetails.username" class="q-mb-md">
              <q-chip color="secondary" text-color="white" size="md">
                <q-icon name="person" left />
                {{ parsedDetails.username }}
              </q-chip>
            </div>

            <div
              v-if="parsedDetails.oldValues && parsedDetails.newValues"
              class="q-mb-md"
            >
              <div class="text-h6 q-mb-sm">Änderungen:</div>
              <div
                class="row q-gutter-md"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div class="col-12 col-md-5">
                  <q-card flat bordered style="border-radius: 5px">
                    <q-card-section class="bg-red-11 text-white">
                      <div class="text-subtitle2">
                        <q-icon name="remove" class="q-mr-xs" />
                        Alte Werte
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div
                        v-for="(value, key) in parsedDetails.oldValues"
                        :key="'old-' + String(key)"
                        class="q-mb-sm"
                        :class="{
                          'field-changed': highlightedChanges.has(String(key)),
                        }"
                      >
                        <strong>{{ formatFieldName(String(key)) }}:</strong>
                        <div class="text-body2 q-ml-sm">
                          {{ formatValue(value, String(key)) }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-5">
                  <q-card flat bordered>
                    <q-card-section class="bg-green-12 text-white">
                      <div class="text-subtitle2">
                        <q-icon name="add" class="q-mr-xs" />
                        Neue Werte
                      </div>
                    </q-card-section>
                    <q-card-section>
                      <div
                        v-for="(value, key) in parsedDetails.newValues"
                        :key="'new-' + String(key)"
                        class="q-mb-sm"
                        :class="{
                          'field-changed': highlightedChanges.has(String(key)),
                        }"
                      >
                        <strong>{{ formatFieldName(String(key)) }}:</strong>
                        <div class="text-body2 q-ml-sm">
                          {{ formatValue(value, String(key)) }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div
              v-else-if="
                parsedDetails &&
                !parsedDetails.oldValues &&
                !parsedDetails.newValues
              "
              class="q-mb-md"
            >
              <div class="text-h6 q-mb-sm">
                <q-chip color="green-12">Objektdaten</q-chip>
              </div>
              <q-card flat bordered>
                <q-card-section>
                  <div
                    v-for="(value, key) in parsedDetails"
                    :key="String(key)"
                    class="q-mb-sm"
                  >
                    <template
                      v-if="
                        String(key) !== 'message' && String(key) !== 'username'
                      "
                    >
                      <strong>{{ formatFieldName(String(key)) }}:</strong>
                      <div class="text-body2 q-ml-sm">
                        {{ formatValue(value, String(key)) }}
                      </div>
                    </template>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div v-else>
            <div class="text-subtitle2 q-mb-sm text-grey-7">Raw Data:</div>
            <pre
              class="text-caption bg-grey-1 q-pa-sm"
              style="border-radius: 4px"
              >{{ JSON.stringify(currentDetails, null, 2) }}</pre
            >
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { AuditLog } from "src/types/AuditLog";
import { fetchAuditLogs } from "src/api/auditLogApi";
import type { QTableProps } from "quasar";
import { date } from "quasar";

const rowsPerPage = ref(20);
const currentPage = ref(1);

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return sortedLogs.value.slice(start, start + rowsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(sortedLogs.value.length / rowsPerPage.value);
});

const highlightedChanges = ref<Set<string>>(new Set());
const highlightChangedField = (fieldKey: string) => {
  highlightedChanges.value.add(fieldKey);
};

function getActionColor(action: string): string {
  switch (action.toLowerCase()) {
    case "create":
      return "positive";
    case "update":
      return "warning";
    case "delete":
      return "negative";
    default:
      return "grey";
  }
}

const logs = ref<AuditLog[]>([]);
const loading = ref(true);

const detailsDialog = ref(false);
const currentDetails = ref<unknown>(null);

const parsedDetails = computed(() => {
  if (!currentDetails.value) return null;

  try {
    if (typeof currentDetails.value === "object") {
      return currentDetails.value;
    }

    if (typeof currentDetails.value === "string") {
      return JSON.parse(currentDetails.value);
    }

    return null;
  } catch (error) {
    console.error("Error parsing details:", error);
    return null;
  }
});

const sortedLogs = computed(() => {
  return [...logs.value].sort((a, b) => {
    const tA = new Date(a.timestamp).getTime();
    const tB = new Date(b.timestamp).getTime();
    return tB - tA;
  });
});

function showDetails(details: unknown) {
  currentDetails.value = details;
  detailsDialog.value = true;

  if (parsedDetails.value?.oldValues && parsedDetails.value?.newValues) {
    const oldValues = parsedDetails.value.oldValues;
    const newValues = parsedDetails.value.newValues;

    Object.keys(newValues).forEach((key) => {
      if (oldValues[key] !== newValues[key]) {
        highlightChangedField(key);
      }
    });
  }
}

function formatTimestamp(timestamp: string) {
  return date.formatDate(timestamp, "DD.MM.YYYY HH:mm:ss");
}

function formatFieldName(key: string): string {
  const fieldNames: Record<string, string> = {
    id: "ID",
    name: "Name",
    categoryId: "Kategorie-ID",
    description: "Beschreibung",
    price: "Preis",
    icon: "Icon",
    bannerImage: "Banner-Bild",
    username: "Benutzername",
    message: "Nachricht",
  };

  return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Ja" : "Nein";
  }

  if (typeof value === "number") {
    if (key && key.toLowerCase() === "price") {
      return value.toFixed(2) + " €";
    }
    return value.toString();
  }

  if (typeof value === "string") {
    if (value.startsWith("/uploads/images/")) {
      return `Bild: ${value.split("/").pop()}`;
    }
    return value;
  }

  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Objekt kann nicht dargestellt werden]";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
}

const columns: QTableProps["columns"] = [
  {
    name: "timestamp",
    label: "Zeitpunkt",
    field: "timestamp",
    sortable: true,
    format: (val: string) => formatTimestamp(val),
  },
  { name: "username", label: "Benutzer", field: "username", sortable: true },
  { name: "action", label: "Aktion", field: "action", sortable: true },
  { name: "entity", label: "Entität", field: "entity", sortable: true },
  { name: "entityId", label: "Entitäts-ID", field: "entityId", sortable: true },
  { name: "details", label: "Details", field: "details" },
];

onMounted(async () => {
  try {
    logs.value = await fetchAuditLogs();
  } catch (error) {
    console.error("Fehler beim Laden der Audit Logs:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.field-changed {
  animation: highlightField 5s ease-in-out;
  position: relative;
  background: #ffc10742;
}

.q-chip {
  margin: 0 2px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 600px) {
  .q-card-section {
    padding: 8px;
  }

  .row.q-gutter-md > div {
    margin-bottom: 16px;
  }
}
</style>
