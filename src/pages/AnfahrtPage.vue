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
    <q-card class="my-card align-center">
      <q-img class="img" src="./images/anfahrt5.jpg">
        <iframe
          v-if="cookiesAccepted"
          class="iframe q-mt-sm"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2431.1844580471966!2d7.173619478162399!3d52.45768674083941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8274dfe6d92df%3A0xd9cca197bf1dd9c9!2sImbiss%20am%20Tower!5e0!3m2!1sde!2sde!4v1750745008417!5m2!1sde!2sde"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <div
          class="beschreibung column full-width"
          style="display: flex; justify-content: center; align-items: center"
        >
          <span class="text-caption text-grey-6 q-mt-xs"
            >Powered by Google Maps</span
          >
          <q-separator class="content-separator full-width q-mt-md q-mb-md" />

          <h6 class="text-subtitle2 text-subtitle1 text">
            Imbiss am Tower GmbH
          </h6>
          <h6 class="text-subtitle2">Flugplatzstraße 56</h6>
          <h6 class="text-subtitle2">48531 Nordhorn-Klausheide</h6>
        </div>
        <div class="seperator"></div>
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
import { ref, onMounted } from "vue";
const cookiesAccepted = ref(false);
onMounted(() => {
  if (localStorage.getItem("cookiesAccepted") === "true") {
    cookiesAccepted.value = true;
  }
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
