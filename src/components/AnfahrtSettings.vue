<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">KONTAKT</div>
            <div class="text-h5 text-white text-weight-light uppercase">Standort & Karte</div>
          </div>

          <div class="q-mb-xl">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Adresse suchen:</div>
            <div >
              <q-input
                class="col premium-input"
                label="Straße, Hausnummer, PLZ, Ort"
                v-model="searchAddress"
                dark filled
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
                class="luxury-btn q-px-lg full-width q-mt-md"
                @click="searchLocation"
                :loading="isSearching"
                :text-color="schriftFarbe ? 'white' : 'black'"
              />
            </div>
          </div>

          <div class="q-mb-xl">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Suchergebnisse:</div>
            <q-list bordered separator class="premium-glass-card-inner" style="border-radius: 12px; overflow: hidden;">
              <q-item
                v-for="(result, index) in searchResults"
                :key="index"
                clickable
                @click="selectLocation(result)"
              >
                <q-item-section v-if="searchResults.length > 0">
                  <q-item-label class="text-white">{{ result.display_name }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    color="secondary"
                    size="sm"
                    label="Auswählen"
                    flat
                    class="luxury-btn-outline"
                    @click="selectLocation(result)"
                    

                  />
                </q-item-section>
              </q-item>
              
              <q-item v-if="searchResults.length < 1">
                <q-item-section class="q-mt-lg q-mb-lg">
                  <q-item-label class="text-center text-grey-5">Keine Adresse gefunden...</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div v-if="selectedLocation" class="q-mb-xl">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Ausgewählte Adresse:</div>
            <q-card flat bordered class="premium-glass-card-inner q-pa-sm">
              <q-card-section>
                <q-btn
                  size="md"
                  class="float-right"
                  icon="clear"
                  flat
                  round
                  color="grey"
                  @click="clearSelectedLocation()"
                />
                <div class="text-h6 text-secondary">
                  {{ selectedLocation.display_name }}
                </div>
                <div class="text-caption text-grey-4">
                  Koordinaten: {{ selectedLocation.lat }}, {{ selectedLocation.lon }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <q-separator dark class="q-my-lg opacity-10" />

          <div class="q-mb-xl">
            <div v-if="generatedEmbedCode">
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Generierter Embed Code:</div>
              <q-input
                class="full-width premium-input"
                label="Embed Code"
                v-model="generatedEmbedCode"
                dark filled
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
                class="luxury-btn full-width q-mt-md"
                color="secondary"
                label="Speichern"
                @click="saveEmbedCode"
                :loading="isSaving"
              />
            </div>

            <div v-if="generatedEmbedCode.length < 1">
              <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Google Embed-Code einfügen:</div>
              <q-input
                class="full-width premium-input"
                label="Embed Code"
                v-model="ownEmbedCode"
                dark filled
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
                class="luxury-btn full-width q-mt-md"
                color="secondary"
                label="Speichern"
                @click="saveOwnEmbedCode"
                :loading="isSaving"
                :text-color="schriftFarbe ? 'white' : 'black'"
              />
            </div>
          </div>

          <div>
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Mein aktueller Laden-Standort:</div>
            <div v-if="currentEmbedCode" class="preview-container">
              <iframe
                width="100%"
                height="400"
                frameborder="0"
                style="border-radius: 16px; border: 0;"
                :src="currentEmbedCode"
              ></iframe>
            </div>
            <div v-else class="text-center q-pa-xl text-grey-5 premium-glass-card-inner">
              Kein Inhalt verfügbar
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
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

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  addressdetails?: string;
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
    const srcMatch = embedCode.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) return srcMatch[1];
    const urlMatch = embedCode.match(/https?:\/\/[^\s"'<>]+/i);
    return urlMatch ? urlMatch[0] : null;
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

onMounted(async () => {
  await loadExistingMap();
  await loadSchriftFarbe();
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
  margin-top: -70px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  padding-top: 40px;
  padding-bottom: 60px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
  overflow: hidden;
}

.card-inner {
  padding: 40px 30px;
}

.premium-glass-card-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.luxury-btn-outline {
  border: 1px solid var(--q-secondary);
  border-radius: 12px;
  color: white;
}

.preview-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
}
</style>