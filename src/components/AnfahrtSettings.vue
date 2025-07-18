<template>
  <q-list class="full-width">
    <div class="full-width">
      <q-item>
        <q-item-section>
          <q-item-label class="q-mb-sm" caption>Adresse suchen:</q-item-label>
          <div class="row q-gutter-md">
            <q-input
              class="col"
              label="Straße, Hausnummer, PLZ, Ort"
              v-model="searchAddress"
              filled
              @keyup.enter="searchLocation"
              clearable
              @clear="clearSearch()"
            >
              <template v-slot:append>
                <q-icon
                  name="search"
                  color="secondary"
                  class="cursor-pointer"
                  @click="searchLocation"
                />
              </template>
            </q-input>
            <q-btn
              color="secondary"
              label="Suchen"
              @click="searchLocation"
              :loading="isSearching"
            />
          </div>
        </q-item-section>
      </q-item>

      <!-- Suchergebnisse -->
      <q-item>
        <q-item-section>
          <q-item-label class="q-mb-sm" caption>Suchergebnisse:</q-item-label>
          <q-list bordered separator>
            <q-item
              v-for="(result, index) in searchResults"
              :key="index"
              clickable
              @click="selectLocation(result)"
            >
              <q-item-section v-if="searchResults.length > 0">
                <q-item-label>{{ result.display_name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  color="secondary"
                  size="sm"
                  label="Auswählen"
                  @click="selectLocation(result)"
                />
              </q-item-section>
            </q-item>
            <q-item-section class="q-mt-lg q-mb-lg">
              <q-item-label class="text-center" v-if="searchResults.length < 1"
                >Keine Adresse gefunden...</q-item-label
              ></q-item-section
            >
          </q-list>
        </q-item-section>
      </q-item>

      <!-- Ausgewählte Adresse -->
      <q-item v-if="selectedLocation">
        <q-item-section>
          <q-item-label class="q-mb-sm" caption
            >Ausgewählte Adresse:</q-item-label
          >
          <q-card flat bordered>
            <q-card-section>
              <q-btn
                size="md"
                class="float-right"
                icon="clear"
                flat
                color="grey"
                @click="clearSelectedLocation()"
              />
              <div class="text-h6">
                {{ selectedLocation.display_name }}
              </div>
              <div class="text-caption">
                Koordinaten: {{ selectedLocation.lat }},
                {{ selectedLocation.lon }}
              </div>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>

      <q-separator class="q-mt-sm q-mb-sm" />

      <!-- Embed Code -->
      <q-item>
        <q-item-section v-if="generatedEmbedCode">
          <q-item-label class="q-mb-sm" caption
            >Generierter Embed Code:</q-item-label
          >
          <q-input
            class="full-width"
            label="Embed Code"
            v-model="generatedEmbedCode"
            filled
            readonly
          >
            <template v-slot:append>
              <q-icon
                name="content_copy"
                color="secondary"
                class="cursor-pointer"
                @click="copyToClipboard"
              />
            </template>
          </q-input>
          <q-btn
            icon="save"
            class="q-mt-md"
            color="secondary"
            label="Speichern"
            @click="saveEmbedCode"
            :loading="isSaving"
          />
        </q-item-section>

        <q-item-section v-if="generatedEmbedCode.length < 1">
          <q-item-label class="q-mb-sm" caption
            >Adresse nicht gefunden? Google Embed-Code einfügen:</q-item-label
          >
          <q-input
            class="full-width"
            label="Embed Code"
            v-model="ownEmbedCode"
            filled
          >
            <template v-slot:append>
              <q-icon
                name="add_location"
                color="secondary"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-btn
            icon="save"
            class="q-mt-md"
            color="secondary"
            label="Speichern"
            @click="saveOwnEmbedCode"
            :loading="isSaving"
          />
        </q-item-section>
      </q-item>

      <!--  Karte -->

      <q-separator inset class="q-mb-sm q-mt-sm" />

      <q-item>
        <q-item-section>
          <q-item-label class="q-mb-sm" caption
            >Mein aktueller Laden-Standort:</q-item-label
          >
          <div v-if="currentEmbedCode" class="full-width">
            <iframe
              v-if="currentEmbedCode"
              width="100%"
              height="400"
              frameborder="0"
              :src="currentEmbedCode"
            ></iframe>
          </div>
          <div v-else class="text-center q-pa-md text-grey-5">
            Kein Inhalt verfügbar
          </div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { Notify } from "quasar";
import api from "src/boot/axios";
import { onMounted, ref } from "vue";

const searchAddress = ref("");
const searchResults = ref<SearchResult[]>([]);
const selectedLocation = ref<SelectedLocation | null>(null);
const selectedProvider = ref("google");
const generatedEmbedCode = ref("");
const ownEmbedCode = ref("");
const currentEmbedCode = ref("");
const isSearching = ref(false);
const isSaving = ref(false);

interface AddressDetails {
  house_number?: string;
  road?: string;
  city?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  state?: string;
  suburb?: string;
  town?: string;
  village?: string;
}
interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  addressdetails?: AddressDetails;
}

interface SelectedLocation {
  display_name: string;
  lat: number;
  lon: number;
}

const clearSearch = () => {
  searchAddress.value = "";
  searchResults.value = [];
  selectedLocation.value = null;
  generatedEmbedCode.value = "";
};

const clearSelectedLocation = () => {
  selectedLocation.value = null;
  generatedEmbedCode.value = "";
};

const searchLocation = async () => {
  if (!searchAddress.value.trim()) return;

  isSearching.value = true;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress.value)}&limit=5&addressdetails=1&accept-language=de`
    );
    const data = await response.json();
    searchResults.value = data;
  } catch (error) {
    console.error("Fehler bei der Adressensuche:", error);
    Notify.create({
      type: "negative",
      message: "Fehler bei der Adressensuche",
      position: "top",
      icon: "clear",
    });
  } finally {
    isSearching.value = false;
  }
};

const selectLocation = (location: SearchResult) => {
  selectedLocation.value = location;
  generateEmbedCode();
};

const generateEmbedCode = () => {
  if (!selectedLocation.value) return;

  const location = selectedLocation.value;
  const { lat, lon } = location;

  switch (selectedProvider.value) {
    case "google":
      generatedEmbedCode.value = `https://maps.google.com/maps?q=${lat},${lon}&hl=de&z=15&output=embed`;
      break;
  }
};

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(generatedEmbedCode.value);
  Notify.create({
    type: "positive",
    message: "Embed Code in Zwischenablage kopiert",
    position: "top",
    icon: "check",
  });
};

const saveEmbedCode = async () => {
  if (!generatedEmbedCode.value || !selectedLocation.value) return;

  const location = selectedLocation.value;

  isSaving.value = true;
  try {
    await api.post("/api/mapembed", {
      embedCode: generatedEmbedCode.value,
      address: location.display_name,
      coordinates: {
        lat: location.lat,
        lon: location.lon,
      },
      provider: selectedProvider.value,
    });

    currentEmbedCode.value = generatedEmbedCode.value;

    Notify.create({
      type: "positive",
      position: "top",
      icon: "check",
      message: "Karte erfolgreich gespeichert",
    });
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    Notify.create({
      type: "negative",
      position: "top",
      message: "Fehler beim Speichern der Karte",
      icon: "clear",
    });
  } finally {
    isSaving.value = false;
    selectedLocation.value = null;
    generatedEmbedCode.value = "";
  }
};

const saveOwnEmbedCode = async () => {
  if (!ownEmbedCode.value) {
    Notify.create({
      type: "negative",
      message: "Kein eigener Embed-Code zum Speichern vorhanden",
      position: "top",
      icon: "clear",
    });
    return;
  }

  const extractUrlFromEmbedCode = (embedCode: string): string | null => {
    try {
      const srcMatch = embedCode.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const url = srcMatch[1];

        if (url.startsWith("http://") || url.startsWith("https://")) {
          return url;
        }
      }

      const urlMatch = embedCode.match(/https?:\/\/[^\s"'<>]+/i);
      if (urlMatch && urlMatch[0]) {
        return urlMatch[0];
      }

      return null;
    } catch (error) {
      console.error("Fehler beim Extrahieren der URL:", error);
      return null;
    }
  };

  const extractedUrl = extractUrlFromEmbedCode(ownEmbedCode.value);

  if (!extractedUrl) {
    Notify.create({
      type: "negative",
      message: "Keine gültige URL im Embed-Code gefunden",
    });
    return;
  }

  isSaving.value = true;
  try {
    await api.post("/api/mapembed", {
      embedCode: extractedUrl,
      address: "Manuell eingefügt",
      provider: selectedProvider.value,
    });

    currentEmbedCode.value = extractedUrl;
    Notify.create({
      type: "positive",
      message: "Eigener Embed-Code erfolgreich gespeichert",
    });
  } catch (error) {
    console.error("Fehler beim Speichern des eigenen Embed-Codes:", error);
    Notify.create({
      type: "negative",
      message: "Fehler beim Speichern des eigenen Embed-Codes",
    });
  } finally {
    isSaving.value = false;
  }
};

const loadExistingMap = async () => {
  try {
    const response = await api.get("/api/mapembed");

    if (response.data && response.data.embedCode) {
      currentEmbedCode.value = response.data.embedCode;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Karte:", error);
  }
};

onMounted(async () => {
  await loadExistingMap();
});
</script>
