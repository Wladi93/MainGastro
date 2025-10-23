<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="home" class="bannerIcon" />
      Startseite
    </h6>
  </q-banner>
  <div class="oben bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">Willkommen...</h2>

    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <div class="animated-background">
    <body>
      <div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
    </body>
    <section>
      <div class="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>

    <div class="body"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="sky-gradient"></div>
    <div class="clouds-container">
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
      <div class="cloud cloud4"></div>
      <div class="cloud cloud5"></div>
      <div class="cloud cloud6"></div>
      <div class="cloud cloud7"></div>
      <div class="cloud cloud8"></div>
    </div>
    <div class="horizon-clouds">
      <div class="horizon-cloud hcloud1"></div>
      <div class="horizon-cloud hcloud2"></div>
      <div class="horizon-cloud hcloud3"></div>
      <div class="horizon-cloud hcloud4"></div>
    </div>
    <div class="planes-container">
      <div class="plane plane1"></div>
      <div class="plane plane2"></div>
    </div>
    <div class="sunset-planes">
      <div class="sunset-plane splane1"></div>
      <div class="sunset-plane splane2"></div>
      <div class="sunset-plane splane3"></div>
    </div>

    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>

  <div
    class="q-mt-md"
    style="display: flex; justify-content: center; align-items: center"
  >
    <q-card
      class="column my-card"
      style="
        max-width: 100vw;
        background-color: transparent;
        justify-content: center;
      "
      flat
    >
      <div
        class="img-container flex"
        style="justify-content: center; align-items: center"
      >
        <q-img
          class="img"
          v-for="logos in logo.filter((item) => item.id === 2)"
          :key="logos.id"
          :src="getFullImageUrl(logos.url)"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            flex-direction: column;
          "
        >
          <div
            class="text text-subtitle2 text-center column absolute-top inhalt-container"
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <h6 v-for="inhalte in inhalt" :key="inhalte.id" class="q-mt-md">
              {{ inhalte.inhalt1 }}
            </h6>
            <q-separator inset class="q-mb-lg bg-white" size="2px" />

            <div
              class="q-mt-sm"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            ></div>
            <h6
              v-for="inhalte in inhalt"
              :key="inhalte.id"
              class="text-caption text-weight-medium"
            >
              {{ inhalte.inhalt2 }}
            </h6>

            <div
              class="q-mb-md q-mt-md"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-img
                class="flex"
                v-for="logos in logo.filter((item) => item.id === 1)"
                :key="logos.id"
                style="
                  height: 150px;
                  width: 150px;
                  border-radius: 50%;
                  border: 2px solid var(--q-secondary);
                  align-items: center;
                  justify-content: center;
                "
                :src="getFullImageUrl(logos.url)"
              />
            </div>
            <h6
              v-for="inhalte in inhalt"
              :key="inhalte.id"
              class="text-caption"
            >
              {{ inhalte.inhalt3 }}
            </h6>

            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
              class="full-width"
            ></div>
            <q-card-section class="full-width">
              <q-btn
                dense
                label="Zur Speisekarte"
                class="gradient-btn full-width"
                text-color="white"
                color="secondary"
                icon="restaurant_menu"
                clickable
                @click="onSubmit"
              >
              </q-btn>
            </q-card-section>
            <div
              class="q-mt-md"
              style="display: flex; justify-content: center; gap: 20px"
            >
              <div
                class="social-item"
                v-for="firma in firmenName"
                :key="firma.id"
              >
                <q-btn
                  v-if="firma.instagram"
                  round
                  color="pink-5"
                  icon="photo_camera"
                  size="md"
                  :href="firma.instagram!"
                  target="instagram-window"
                  class="social-btn instagram-btn"
                  aria-label="Instagram"
                />
                <div v-if="firma.instagram" class="social-label">Instagram</div>
              </div>
              <div
                class="social-item"
                v-for="firma in firmenName"
                :key="firma.id"
              >
                <q-btn
                  v-if="firma.facebook"
                  round
                  color="blue-7"
                  icon="facebook"
                  size="md"
                  :href="firma.facebook!"
                  target="facebook-window"
                  class="social-btn facebook-btn"
                  aria-label="Facebook"
                />
                <div v-if="firma.facebook" class="social-label">Facebook</div>
              </div>
              <div
                class="social-item"
                v-for="firma in firmenName"
                :key="firma.id"
              >
                <q-btn
                  v-if="firma.lieferando"
                  round
                  color="orange"
                  icon="takeout_dining"
                  size="md"
                  :href="firma.lieferando!"
                  target="lieferando-window"
                  class="social-btn facebook-btn"
                  aria-label="Lieferando"
                />
                <div v-if="firma.lieferando" class="social-label">
                  Lieferando
                </div>
              </div>
            </div>
            <q-separator inset class="q-mt-lg q-mb-sm bg-white" size="2px" />
            <h6
              v-for="inhalte in inhalt"
              :key="inhalte.id"
              class="text-overline"
            >
              {{ inhalte.inhalt4 }}
            </h6>
          </div>
        </q-img>

        <div class="img-particles">
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
        </div>

        <div class="glow-effect"></div>
      </div>
    </q-card>
  </div>
  <h5 class="text-caption text-center color-secondary">
    Sie haben Fragen? zum
    <RouterLink class="text-accent" to="/kontakt">Kontaktformular</RouterLink>
  </h5>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLogo } from "../composables/LogoLoad";
import { onBeforeUnmount, onMounted } from "vue";
import { useFirmenName } from "../composables/Firmenname";
import { useInhalt } from "../composables/InhaltLoad";
import api from "src/boot/axios";

const router = useRouter();
const onSubmit = () => {
  void router.push("/speisekarte");
};

const { loadLogo, logo, getFullImageUrl } = useLogo();
const { loadInhalt, inhalt } = useInhalt();

const { firmenName, loadFirmenName } = useFirmenName();

const applyStylesheetFromApi = async () => {
  try {
    const response = await api.get("/api/hintergrund/active");
    const cssPath = response.data.cssName;

    if (cssPath) {
      const link = document.createElement("link");
      link.id = "dynamic-theme";
      link.rel = "stylesheet";
      link.href = cssPath;
      document.head.appendChild(link);
    }
  } catch (error) {
    console.error("Fehler beim Laden des CSS-Themes:", error);
  }
};

onMounted(async () => {
  await loadLogo();
  await loadFirmenName();
  await loadInhalt();
  await applyStylesheetFromApi();
});

onBeforeUnmount(() => {
  const existingLink = document.getElementById("dynamic-theme");
  if (existingLink) {
    existingLink.remove();
  }
});
</script>

<style scoped>
.lol {
  border: 1px solid;
}
.bannerImage {
  height: 230px;
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
.img {
  max-width: 80vw;
  min-height: 80vh;
}
.inhalt-container {
  background-color: var(--q-warning);
  height: auto;
}

@media (max-width: 600px) {
  .bannerImage {
    height: 130px;
  }
  .inhalt-container {
    height: auto;
  }
  .oben {
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
}
</style>
