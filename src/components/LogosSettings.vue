<template>
  <q-item-label class="q-mb-sm">Logos & Bilder:</q-item-label>

  <q-list separator class="full-width" v-for="logos in logo" :key="logos.id">
    <q-item-section>
      <q-item-label class="q-mb-sm" caption>{{ logos.name }}:</q-item-label>
      <q-card class="full-width flex column items-center">
        <q-img
          :class="logos.id === 1 ? 'q-my-xs' : 'q-my-xs'"
          alt="Logo"
          :ratio="1"
          :src="getFullImageUrl(logos.url)"
          width="90vw"
          height="10vh"
          spinner-color="secondary"
          :style="
            logos.id === 1
              ? 'border: solid 1px var(--q-primary); border-radius: 50%; width: 100px; height: 100px'
              : 'border-radius: 4px'
          "
        />

        <div class="q-gutter-sm full-width">
          <q-file
            class="full-width"
            :label="logos.id === 1 ? 'Logo hochladen' : 'Bild hochladen'"
            filled
            accept="image/*"
            :model-value="getUploadState(logos.id).selectedFile"
            @update:model-value="(file) => onFileChange(file, logos.id)"
            :loading="getUploadState(logos.id).isUploading"
            :disable="getUploadState(logos.id).uploadStatus === 'uploading'"
          >
            <template v-slot:prepend>
              <q-icon name="file_upload" />
            </template>
          </q-file>

          <div
            v-if="getUploadState(logos.id).uploadStatus !== 'idle'"
            class="q-mt-sm"
          >
            <q-linear-progress
              v-if="getUploadState(logos.id).uploadStatus === 'uploading'"
              :value="getUploadState(logos.id).uploadProgress / 100"
              color="positive"
              size="16px"
              class="q-mt-sm"
              rounded
            >
              <div
                class="absolute-full flex flex-center items-center justify-center"
              >
                <q-badge
                  color="white"
                  text-color="secondary"
                  :label="`${getUploadState(logos.id).uploadProgress}%`"
                />
              </div>
            </q-linear-progress>

            <q-item-section
              v-if="getUploadState(logos.id).uploadStatus === 'success'"
              class="text-positive text-caption q-mb-xs flex row justify-center items-center"
            >
              <div class="flex row">
                <q-icon name="check_circle" class="q-mr-sm" />
                <q-item-label> Logo erfolgreich hochgeladen </q-item-label>
              </div>
            </q-item-section>

            <q-item-section
              v-if="getUploadState(logos.id).uploadStatus === 'error'"
              class="text-negative text-caption q-mb-sm flex row justify-center items-center"
            >
              <div class="flex row">
                <q-icon name="error" class="q-mr-xs" />
                <q-item-label> Fehler beim Hochladen </q-item-label>
              </div>
            </q-item-section>
          </div>
        </div>
      </q-card>
      <q-separator class="q-my-md" />
    </q-item-section>
  </q-list>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLogo } from "src/composables/LogoLoad";

const { loadLogo, logo, getFullImageUrl, getUploadState, onFileChange } =
  useLogo();

onMounted(async () => {
  await loadLogo();
});
</script>
