<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 10;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">Startseite</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">


      <div class="premium-glass-card shadow-24">
        <div class="card-inner column items-center">
          
          <div class="img-container full-width">
            <q-img
              class="img-styled"
              v-for="logos in logo.filter((item) => item.id === 2)"
              :key="logos.id"
              :src="getFullImageUrl(logos.url)"
            >
              <template v-slot:default>
                <div class="absolute-full content-overlay column items-center justify-center">
                  <h6 v-for="inhalte in inhalt" :key="inhalte.id" class="text-h6 text-weight-bold q-ma-none text-white">
                    {{ inhalte.inhalt1 }}
                  </h6>
                  
                  <q-separator dark class="q-my-md opacity-2 separator-width" />

                  <h6 v-for="inhalte in inhalt" :key="inhalte.id" class="text-subtitle2 text-weight-medium text-white">
                    {{ inhalte.inhalt2 }}
                  </h6>

                  <div class="q-my-lg full-width flex justify-center">
                    <q-img
                      v-for="logos in logo.filter((item) => item.id === 1)"
                      :key="logos.id"
                      class="profile-logo"
                      :src="getFullImageUrl(logos.url)"
                      fit="contain" 
                    />
                  </div>

                  <h6 v-for="inhalte in inhalt" :key="inhalte.id" class="text-caption text-grey-4">
                    {{ inhalte.inhalt3 }}
                  </h6>

                  <div class="full-width q-mt-lg btn-wrapper">
                    <q-btn
                      label="Zur Speisekarte"
                      class="premium-btn full-width"
                      icon="restaurant_menu"
                      @click="onSubmit"
                      :text-color="schriftFarbe ? 'white' : 'black'"
                    />
                  </div>

                  <div class="row justify-center q-gutter-md q-mt-xl">
                    <div class="social-item column items-center" v-for="firma in firmenName" :key="firma.id">
                      <q-btn
                        v-if="firma.instagram"
                        round
                        flat
                        class="glass-btn"
                        icon="photo_camera"
                        :href="firma.instagram!"
                        target="_blank"
                      />
                      <span v-if="firma.instagram" class="social-label">Instagram</span>
                    </div>
                    
                    <div class="social-item column items-center" v-for="firma in firmenName" :key="firma.id">
                      <q-btn
                        v-if="firma.facebook"
                        round
                        flat
                        class="glass-btn"
                        icon="facebook"
                        :href="firma.facebook!"
                        target="_blank"
                      />
                      <span v-if="firma.facebook" class="social-label">Facebook</span>
                    </div>

                    <div class="social-item column items-center" v-for="firma in firmenName" :key="firma.id">
                      <q-btn
                        v-if="firma.lieferando"
                        round
                        flat
                        class="glass-btn"
                        icon="takeout_dining"
                        :href="firma.lieferando!"
                        target="_blank"
                      />
                      <span v-if="firma.lieferando" class="social-label">Lieferando</span>
                    </div>
                  </div>

                  <q-separator dark class="q-mt-xl q-mb-sm separator-width opacity-2" />
                  
                  <h6 v-for="inhalte in inhalt" :key="inhalte.id" class="text-overline text-grey-5">
                    {{ inhalte.inhalt4 }}
                  </h6>
                </div>
              </template>
            </q-img>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mt-xl q-mb-xl text-grey-5">
        Sie haben Fragen? zum 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/kontakt">
          Kontaktformular
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLogo } from "../composables/LogoLoad";
import { onBeforeUnmount, onMounted, ref } from "vue";
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
  await loadLogo();
  await loadFirmenName();
  await loadInhalt();
  await applyStylesheetFromApi();
  await loadSchriftFarbe();
});

onBeforeUnmount(() => {
  const existingLink = document.getElementById("dynamic-theme");
  if (existingLink) {
    existingLink.remove();
  }
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
}

.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  top: 53px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.content-wrapper {
  width: 100%;
  max-width: 600px;
  padding-top: 80px;
  
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
  padding: 0;
}

.img-container {
  position: relative;
}

.img-styled {
  border-radius: 32px;
  min-height: 800px;
}

.content-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
  padding: 40px 30px;
  text-align: center;
}

.separator-width {
  width: 80%;
  max-width: 300px;
}

.btn-wrapper {
  max-width: 400px;
  padding: 0 20px;
}

.profile-logo {
  width: 100%;
  max-width: 300px;
  min-width: 300px;
  height: auto;
  min-height: 150px;
}

.premium-btn {
  background: var(--q-secondary) !important;
  border-radius: 12px;
  font-weight: bold;
  height: 50px;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--q-secondary);
}

.social-label {
  font-size: 10px;
  color: #aaa;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.no-decoration {
  text-decoration: none;
}

.opacity-2 {
  opacity: 0.2;
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .content-wrapper {
    padding-top: 80px;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .content-overlay {
    padding: 30px 20px;
  }
  
  .img-styled {
    min-height: 750px;
  }
  
  .profile-logo {
    max-width: 200px;
    min-height: 120px;
  }
  
  .btn-wrapper {
    padding: 0 10px;
  }
  
  .premium-btn {
    height: 48px;
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .img-styled {
    min-height: 850px;
  }
  
  .content-overlay {
    padding: 25px 15px;
  }
}
</style>