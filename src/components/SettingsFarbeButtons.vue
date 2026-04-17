<template>
  <q-dialog v-model="isOpen" backdrop-filter="blur(15px)">
    <q-card class="premium-glass-card shadow-24">
      <div class="card-inner">
        
        <div class="text-center q-mb-xl">
          <div class="text-overline text-secondary text-weight-bold tracking-widest">DESIGN</div>
          <div class="text-h5 text-white text-weight-light uppercase">Farbe anpassen</div>
        </div>

        <div class="picker-wrapper">
          <q-color
            v-model="colorButtons"
            no-header
            no-footer
            default-view="spectrum"
            class="premium-picker"
          />
        </div>

        <div class="q-mt-xl">
          <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider">Aktueller Farbwert</div>
          <div class="premium-glass-card-inner color-input-box">
            <div class="row items-center no-wrap full-width">
              <div class="color-preview q-mx-md" :style="`background: ${colorButtons.length === 7 ? colorButtons : '#333'}`"></div>
              
              <q-input
                :model-value="colorButtons"
                @update:model-value="handleManualInput"
                dark
                borderless
                dense
                class="full-width text-h6 font-mono"
                input-class="text-white uppercase"
                placeholder="#000000"
              >
                <template v-slot:append>
                  <q-icon name="edit" color="secondary" size="xs" class="q-mr-sm" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <q-btn
          label="Auswahl bestätigen"
          color="secondary"
          unelevated
          class="luxury-btn full-width q-mt-xl"
          @click="isOpen = false"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { setCssVar } from "quasar";
import api from "src/boot/axios";

const isOpen = defineModel<boolean>("isOpen", { default: false });
const colorButtons = defineModel<string>("colorButtons", {
  required: true,
});
const schriftFarbe = defineModel<boolean>("schriftFarbe");

const loadColor = async () => {
  try {
    const res = await api.get("api/color/2");

    if (res.data && res.data.color) {
      colorButtons.value = res.data.color;
      schriftFarbe.value = Boolean(res.data.schriftFarbe);
      setCssVar("secondary", colorButtons.value);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Farbe", error);
  }
};

const saveColor = async (newColor: string, id: number) => {
  try {
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      await api.put("api/color/2", { id, color: newColor, schriftFarbe: schriftFarbe.value });
    }
  } catch (error) {
    console.error("Fehler beim speichern der Farbe", error);
  }
};

const handleManualInput = (val: string | number | null) => {
  let stringVal = String(val || '');
  
  if (stringVal && !stringVal.startsWith('#')) {
    stringVal = '#' + stringVal;
  }
  
  if (stringVal.length > 7) {
    stringVal = stringVal.substring(0, 7);
  }
  
  colorButtons.value = stringVal;
};

watch(colorButtons, async (newVal) => {
  if (/^#[0-9A-F]{6}$/i.test(newVal)) {
    setCssVar("secondary", newVal);
    await saveColor(newVal, 2);
  }
});

watch(schriftFarbe, async () => {
  if (/^#[0-9A-F]{6}$/i.test(colorButtons.value)) {
    await saveColor(colorButtons.value, 2);
  }
});

onMounted(async () => {
  await loadColor();
});
</script>

<style scoped>
.premium-glass-card {
  background: rgba(15, 15, 15, 0.85) !important;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  min-width: 380px;
  max-width: 95vw;
}

.card-inner {
  padding: 40px 30px;
}

.picker-wrapper {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-picker {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  width: 100%;
}

.premium-picker :deep(.q-color-picker__spectrum) {
  border-radius: 16px;
}

.color-input-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  height: 60px;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  box-shadow: 0 0 15px v-bind('colorButtons.length === 7 ? colorButtons + "4D" : "transparent"'); 
  transition: background 0.3s ease;
}

.luxury-btn {
  border-radius: 16px;
  font-weight: 700;
  height: 55px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }
.font-mono { font-family: monospace; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
  .premium-glass-card { min-width: 90vw; }
}
</style>