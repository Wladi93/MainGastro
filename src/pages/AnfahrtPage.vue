<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon class="bannerIcon" name="directions_car" />
      Anfahrt
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      hier findest du uns...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <q-img class="background-img" />

  <div class="q-mt-md row items-start">
    <q-card
      v-for="firma in firmenName"
      :key="firma.id"
      class="my-card align-center"
    >
      <q-img
        v-for="logos in logo.filter((item) => item.id === 3)"
        :key="logos.id"
        class="img"
        :src="getFullImageUrl(logos.url)"
      >
        <div
          class="full-width"
          style="display: flex; justify-content: center; align-items: center"
        >
          <iframe
            class="iframe q-mt-sm"
            allowfullcreen="true"
            referrerpolicy="no-referrer-when-downgrade"
            :src="embedCode"
            width="100%"
            height="400"
            frameborder="0"
          ></iframe>
        </div>

        <div
          class="beschreibung column full-width"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            bottom: 0;
          "
        >
          <span class="text-caption text-grey-6 q-mt-xs"
            >Powered by Google Maps</span
          >
          <q-separator class="content-separator full-width q-mt-md q-mb-md" />

          <h6 class="text-subtitle2 text-subtitle1 text">
            {{ firma.firmenName }}
          </h6>
          <h6 class="text-subtitle2">
            {{ firma.strasse }} {{ firma.hausnummer }}
          </h6>
          <h6 class="text-subtitle2">{{ firma.plz }} {{ firma.ort }}</h6>
        </div>
      </q-img>
    </q-card>
  </div>

  <h5 class="text-caption text-center color-secondary">
    Bestellen? zur
    <RouterLink class="text-secondary" to="/speisekarte"
      >Speisekarte</RouterLink
    >
  </h5>

  <div></div>
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useFirmenName } from "../composables/Firmenname";
import { useLogo } from "../composables/LogoLoad";
const cookiesAccepted = ref(false);
const embedCode = ref("");
const { firmenName, loadFirmenName } = useFirmenName();

const { logo, loadLogo, getFullImageUrl } = useLogo();

const loadExistingMap = async () => {
  try {
    const response = await api.get("/api/mapembed");

    embedCode.value = response.data.embedCode;
  } catch (error) {
    console.error("Fehler beim Laden der Karte:", error);
  }
};
onMounted(async () => {
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookiesAccepted.value = true;
  }
  await loadExistingMap();
  await loadFirmenName();
  await loadLogo();
});
</script>

<style scoped>
.img {
  max-width: 900px;
  height: 75vh;
}
.full-height {
  min-height: 100vh;
}

.bannerImage {
  height: 230px;
}
.indexCard {
  z-index: 0;
}
.map-attribution {
  text-align: center;
  padding: 0.5rem 1.5rem 1rem;
}

.content-separator {
  background: linear-gradient(
    90deg,
    transparent 0%,
    white 50%,
    transparent 100%
  );
  height: 2px;
}
.my-card {
  min-width: 900px;
  margin-top: 1%;
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);

  text-align: center;
}
.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-image: url("./images/anfahrt5.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(6px);
  opacity: 0.6;
  z-index: -1;
}

p.one {
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
}
.iframe {
  opacity: 0.95;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2px;
  border: 2px solid white;
  height: 50vh;
  width: 96%;
  display: flex;
  z-index: 120;
}
.separator {
  margin-top: 10px;
  margin-bottom: 10px;
}

.icon {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2%;
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
    font-size: 20px;
  }
  .my-card {
    min-width: 94%;
    margin-top: 1%;
    box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);

    text-align: center;
  }
}
</style>
