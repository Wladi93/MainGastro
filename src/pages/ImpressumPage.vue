<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon class="bannerIcon" name="article" />
      Impressum
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />

    <h2 class="textOben text-h5 text-weight-thin text-center">
      Unsere Daten...
    </h2>

    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>
  <q-img class="background-img" />

  <q-card class="my-card q-mt-lg" v-for="firma in firmenName" :key="firma.id">
    <q-img
      v-for="logos in logo.filter((item) => item.id === 5)"
      :key="logos.id"
      class="img"
      :src="getFullImageUrl(logos.url)"
    >
      <div class="text text-subtitle2 absolute-top text-center">
        <h6>Impressum</h6>
        <q-separator inset class="q-mb-lg bg-grey-8" size="2px" />
        <h6 class="text-body2 text-weight-bolder">Geschäftsführer</h6>
        <h6 class="text-caption text-weight-medium">
          {{ firma.geschaeftsführerName }}
        </h6>
        <h6 class="text-caption">{{ firma.strasse }} {{ firma.hausnummer }}</h6>
        <h6 class="text-caption">{{ firma.plz }} {{ firma.ort }}</h6>
        <h6 class="text-caption">Deutschland</h6>
        <h6 class="text-caption text-weight-medium">
          Telefon:
          <a class="text-secondary" :href="'tel:' + firma.telefonnummer">
            {{ firma.telefonnummer }}
          </a>
        </h6>

        <h6 class="text-caption text-weight-medium">
          E-Mail:
          <a class="text-secondary" :href="'mailto:' + firma.email">{{
            firma.email
          }}</a>
        </h6>
        <q-separator
          inset
          class="separator bg-white q-mb-md q-mt-md"
          width="10px"
        />
        <h6 class="text-caption">Kleingewerbe gemäß § 19 UStG.</h6>
        <h6 class="text-caption">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
        </h6>
        <h6 class="text-caption text-weight-medium">
          {{ firma.geschaeftsführerName }}
        </h6>
        <h6 class="text-caption">{{ firma.strasse }} {{ firma.hausnummer }}</h6>
        <h6 class="text-caption">{{ firma.plz }} {{ firma.ort }}</h6>
        <h6 class="text-caption">Deutschland</h6>
        <q-separator inset class="q-mt-lg q-mb-sm bg-grey-8" size="2px" />
        <h6 class="text-overline">
          Bei Fragen, bitte an den Geschäftsführer wenden.
          <p></p>
        </h6>
      </div>
    </q-img>
  </q-card>

  <div
    style="
      display: flex;
      justify-content: center;
      justify-items: center;
      font-size: 16px;
    "
    class="text-caption q-mt-md"
  >
    <h5 class="text-caption text-center color-secondary">
      Unsere Auswahl entdecken? zur
      <RouterLink class="text-accent" to="/speisekarte">Speisekarte</RouterLink
      >.
    </h5>
  </div>
</template>

<script setup lang="ts">
import type { Firmenname } from "./types/SettingsFirmenNameType";
import { onMounted, ref } from "vue";
import api from "src/boot/axios";
import { useLogo } from "../composables/LogoLoad";

const firmenName = ref<Firmenname[]>([]);
const { loadLogo, getFullImageUrl, logo } = useLogo();

const loadFirmenName = async () => {
  try {
    const response = await api.get("api/firmenname/");
    firmenName.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden des Namens", error);
  }
};

onMounted(async () => {
  await loadFirmenName();
  await loadLogo();
});
</script>

<style scoped>
.my-card {
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  text-align: center;
  width: 94%;
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/impressum.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}

.img {
  max-width: 900px;
  height: 1000px;
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
    font-size: 20px;
  }
  .my-card {
    height: auto;
  }
  .img {
    max-width: 900px;
    height: 600px;
  }
}
</style>
