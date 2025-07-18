<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="schedule" class="bannerIcon" />
      Öffnungszeiten
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      unser Öffnungszeiten...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <q-img class="background-img" />
  <q-card class="my-card q-mt-lg">
    <q-img
      v-for="logos in logo.filter((item) => item.id === 4)"
      :key="logos.id"
      class="img"
      :src="getFullImageUrl(logos.url)"
    >
      <div class="text text-subtitle2 absolute-top text-center">
        <h6>Öffnungszeiten</h6>
        <q-separator inset class="q-mb-lg bg-grey-8" size="2px" />
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
            "
          >
            <div
              style="display: flex; gap: 20px"
              v-for="oeffnungszeit in oeffnungsZeiten"
              :key="oeffnungszeit.id"
            >
              <div style="width: 100px">
                <h6 class="text-body2">{{ oeffnungszeit.tag }}:</h6>
              </div>
              <div>
                <h6 class="text-body2">
                  {{ oeffnungszeit.von }} Uhr - {{ oeffnungszeit.bis }} Uhr
                </h6>
              </div>
            </div>
            <q-separator class="bg-white" size="4px" />
          </div>
        </div>

        <q-separator inset class="q-mt-lg q-mb-sm bg-grey-8" size="2px" />
        <h6 class="text-overline">
          An Feiertagen gelten gesonderte Öffnungszeiten.
        </h6>
      </div>
    </q-img>
  </q-card>
  <h5 class="text-caption text-center color-secondary">
    Unsere Auswahl entdecken? zur
    <RouterLink class="text-accent" to="/speisekarte">Speisekarte</RouterLink>
  </h5>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Oeffnungszeiten } from "./types/OeffnungszeitenType";
import api from "src/boot/axios";
import { useLogo } from "../composables/LogoLoad";

const oeffnungsZeiten = ref<Oeffnungszeiten[]>([]);

const loadOeffnungszeiten = async () => {
  try {
    const response = await api.get(`/api/oeffnungszeiten`);
    oeffnungsZeiten.value = response.data;
    oeffnungsZeiten.value.sort((a, b) => {
      return a.id >= b.id ? 1 : -1;
    });
  } catch (error) {
    console.error(`Error fetching opening hours`, error);
  }
};

const { loadLogo, logo, getFullImageUrl } = useLogo();

onMounted(async () => {
  await loadOeffnungszeiten();
  await loadLogo();
});
</script>

<style scoped>
.my-card {
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  text-align: center;
  width: 94%;
}
.img {
  max-width: 900px;
  height: 1000px;
}
.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/uhr.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.text {
  display: grid;
}
.separator {
  margin-left: auto;
  margin-right: auto;
}
.abstand {
  margin-bottom: 20px;
}
.bannerIcon {
  size: 30px;
}
@media (max-width: 600px) {
  .bannerImage {
    height: 130px;
  }
  .above {
    display: flex;
    justify-content: center;
    flex-direction: row;
    height: 45px;
  }
  .textOben {
    font-size: 12px;
  }
  .separatorOben {
    display: flex;
    flex-direction: row;
    top: 0;
    max-height: 8px;
  }
  .banner {
    max-height: 10px;
  }
  .bannerText {
    font-size: 12px;
  }
  .bannerIcon {
    font-size: 22px;
  }
  .img {
    max-width: 900px;
    height: 600px;
  }
}
</style>
