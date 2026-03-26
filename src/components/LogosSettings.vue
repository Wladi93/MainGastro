<template>
  <div class="app-container flex justify-center">
    <div class="content-wrapper q-px-md">
      
      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div class="text-center q-mb-xl">
            <div class="text-overline text-secondary text-weight-bold tracking-widest">MEDIA</div>
            <div class="text-h5 text-white text-weight-light uppercase">Logos & Bilder</div>
          </div>

          <div v-for="logos in logo" :key="logos.id" class="q-mb-xl">
            <div class="text-caption text-grey-5 q-mb-md uppercase tracking-wider">
              {{ logos.name }}
            </div>

            <div class="image-preview-container q-mb-lg">
              <q-img
                :src="getFullImageUrl(logos.url)"
                spinner-color="secondary"
                class="premium-image"
                fit="contain"
              >
                <template v-slot:loading>
                  <q-spinner-ios color="secondary" />
                </template>
              </q-img>
            </div>

            <div class="upload-section">
              <q-file
                dark
                filled
                :label="logos.id === 1 ? 'Neues Logo wählen' : 'Neues Bild wählen'"
                accept="image/*"
                class="premium-input"
                :model-value="getUploadState(logos.id).selectedFile"
                @update:model-value="(file) => onFileChange(file, logos.id)"
                :loading="getUploadState(logos.id).isUploading"
                :disable="getUploadState(logos.id).uploadStatus === 'uploading'"
              >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" color="secondary" />
                </template>
              </q-file>

              <div v-if="getUploadState(logos.id).uploadStatus !== 'idle'" class="q-mt-md">
                
                <q-linear-progress
                  v-if="getUploadState(logos.id).uploadStatus === 'uploading'"
                  :value="getUploadState(logos.id).uploadProgress / 100"
                  color="secondary"
                  size="20px"
                  rounded
                  class="premium-progress"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge color="white" text-color="black" :label="`${getUploadState(logos.id).uploadProgress}%`" />
                  </div>
                </q-linear-progress>

                <div v-if="getUploadState(logos.id).uploadStatus === 'success'" 
                     class="status-msg text-positive flex items-center justify-center q-pa-sm">
                  <q-icon name="check_circle" size="xs" class="q-mr-sm" />
                  <span>Upload erfolgreich</span>
                </div>

                <div v-if="getUploadState(logos.id).uploadStatus === 'error'" 
                     class="status-msg text-negative flex items-center justify-center q-pa-sm">
                  <q-icon name="error" size="xs" class="q-mr-sm" />
                  <span>Fehler beim Hochladen</span>
                </div>
              </div>
            </div>
            
            <q-separator v-if="logo.indexOf(logos) !== logo.length - 1" dark class="q-mt-xl opacity-10" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLogo } from "src/composables/LogoLoad";

const { loadLogo, logo, getFullImageUrl, getUploadState, onFileChange } = useLogo();

onMounted(async () => {
  await loadLogo();
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
  padding-bottom: 60px;
  padding-top: 40px;
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

.image-preview-container {
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.premium-image {
  max-height: 180px;
  border-radius: 12px;
}

.premium-input :deep(.q-field__control) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-progress {
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-msg {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  font-weight: 500;
}

.opacity-10 { opacity: 0.6; }
.tracking-widest { letter-spacing: 3px; }
.tracking-wider { letter-spacing: 1.5px; }
.uppercase { text-transform: uppercase; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
  .content-wrapper { padding-top: 20px; }
}
</style>