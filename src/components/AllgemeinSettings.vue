<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest ">EINSTELLUNGEN</div>
            <div class="text-h5 text-white text-weight-light uppercase">Firmendaten & Design</div>
          </div>

          <div class="q-mb-sm">
            <div class="text-caption text-grey-5 q-mb-sm uppercase tracking-wider ">Farbeinstellungen</div>
            <div class="premium-glass-card-inner q-pa-md" style="background: rgba(255,255,255,0.03); border-radius: 16px;">
              <div class="row items-center justify-between no-wrap">
                <div class="row items-center">
                  <div class="text-subtitle2 text-white q-mr-md">Button-Farbe:</div>
                  <q-icon color="secondary" name="lens" size="sm" />
                </div>
                <q-btn
                  icon="opacity"
                  @click="openDialogZweitfarbe"
                  label="ändern"
                  color="secondary"
                  class="luxury-btn-outline q-px-md"
                  flat
                />
              </div>
            </div>
          </div>
          
          <q-separator dark class="q-my-md opacity-10  " />

            <div class="text-caption text-grey-5 q-mb-xl uppercase tracking-wider">Firmendaten</div>

          <div v-for="firma in firmenName" :key="firma.id" class="q-gutter-y-lg ">
            
   
              <div  >
                <q-input
                  label="Firmenname"
                  dark filled
                  v-model="firma.firmenName"
                  class="premium-input "
                >
                  <template v-slot:prepend><q-icon name="business" /></template>
                </q-input>
              </div>
              <div >
                <q-input
                  label="USt-IdNr."
                  dark filled
                  v-model="firma.ustIdNr"
                  class="premium-input"
                >
                  <template v-slot:prepend><q-icon name="pin" /></template>
                </q-input>
              </div>

              <q-separator dark class="q-my-md opacity-10 q-mt-xl" />

            <div class="text-caption text-grey-5 q-mt-lg q-mb-none uppercase tracking-wider">Anschrift & Kontakt</div>
            
            <q-input dark filled v-model="firma.geschaeftsführerName" label="Geschäftsführer" class="premium-input">
              <template v-slot:prepend><q-icon name="person" /></template>
            </q-input>

            <div class="row q-col-gutter-md">
              <div class="col-8">
                <q-input dark filled v-model="firma.strasse" label="Straße" class="premium-input">
                  <template v-slot:prepend><q-icon name="signpost" /></template>
                </q-input>
              </div>
              <div class="col-4">
                <q-input dark filled v-model="firma.hausnummer" label="Nr." class="premium-input">
                  <template v-slot:prepend><q-icon name="house" /></template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-input dark filled v-model="firma.plz" label="PLZ" class="premium-input">
                  <template v-slot:prepend><q-icon name="123" /></template>
                </q-input>
              </div>
              <div class="col-8">
                <q-input dark filled v-model="firma.ort" label="Ort" class="premium-input">
                  <template v-slot:prepend><q-icon name="apartment" /></template>
                </q-input>
              </div>
            </div>

            <q-input dark filled v-model="firma.email" label="E-Mail" class="premium-input">
              <template v-slot:prepend><q-icon name="mail" /></template>
            </q-input>

            <q-input
              dark filled
              v-model="firma.telefonnummer"
              label="Telefonnummer"
              class="premium-input"
              @update:model-value="

            (val: string | number | null) => {

              if (val && typeof val === 'string' && !val.startsWith('+49')) {

                if (val.startsWith('0')) {

                  firma.telefonnummer = '+49' + val.substring(1);

                } else {

                  firma.telefonnummer = '+49' + val;

                }

              }

            }

          "
              
            >
              <template v-slot:prepend><q-icon name="phone_iphone" /></template>
            </q-input>

<q-separator dark class="q-my-md opacity-10 q-mt-xl" />

            <div class="text-caption text-grey-5 q-mt-lg q-mb-none uppercase tracking-wider">Online-Präsenz</div>
            
            <q-input dark filled v-model="firma.lieferando" label="Lieferando-Link" class="premium-input">
              <template v-slot:prepend><q-icon name="takeout_dining" /></template>
            </q-input>

  
              <div class="col-12 col-sm-6">
                <q-input dark filled v-model="firma.instagram" label="Instagram" class="premium-input">
                  <template v-slot:prepend><q-icon name="photo_camera" /></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input dark filled v-model="firma.facebook" label="Facebook" class="premium-input">
                  <template v-slot:prepend><q-icon name="facebook" /></template>
                </q-input>
              </div>
         

            <q-btn
              icon="save"
              label="Änderungen speichern"
              color="secondary"
              class="luxury-btn full-width q-mt-xl"
              @click="updateFirmenName(firma)"
            />
          </div>
        </div>
      </div>
    </div>

    <SettingsFarbeButtons
      v-model:colorButtons="colorButtons"
      v-model:isOpen="isOpenButtons"
      @change:colorButtons="colorButtons = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useFirmenName } from "src/composables/Firmenname";
import { onMounted, ref } from "vue";
import SettingsFarbeButtons from "src/components/SettingsFarbeButtons.vue";

const colorButtons = ref("");
const isOpenButtons = ref(false);

const { firmenName, loadFirmenName, updateFirmenName } = useFirmenName();

function openDialogZweitfarbe() {
  isOpenButtons.value = true;
}


onMounted(async () => {
  await loadFirmenName();
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

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.premium-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.5);
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.luxury-btn-outline {
  border: 1px solid var(--q-secondary);
  border-radius: 12px;
  color: white;
}

.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }
.opacity-10 { opacity: 0.6; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
  .content-wrapper { padding-top: 20px;  }
}
</style>