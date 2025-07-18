<template>
  <q-layout view="hHh lpr fff" v-for="firma in firmenName" :key="firma.id">
    <q-header class="bg-primary text-white header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawerLeft = !drawerLeft" />
        <q-toolbar-title
          @click="$router.push(`/`)"
          class="cursor headerTxt q-mr-xl"
          align="center"
        >
          <q-avatar class="q-mr-md">
            <img
              v-for="logos in logo.filter((item) => item.id === 1)"
              :key="logos.id"
              :src="getFullImageUrl(logos.url)"
            />
          </q-avatar>
          {{ firma.firmenName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      side="left"
      :breakpoint="500"
      overlay
      behavior="mobile"
      ><q-header class="bg-primary text-white">
        <q-toolbar>
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="drawerLeft = !drawerLeft"
          />
          <q-toolbar-title class="headerTxt absolute-center">
            <q-avatar size="md">
              <img
                v-for="logos in logo.filter((item) => item.id === 1)"
                :key="logos.id"
                :src="getFullImageUrl(logos.url)"
              />
            </q-avatar>
          </q-toolbar-title>
        </q-toolbar>
        <q-footer reveal class="bg-primary text-white">
          <q-toolbar>
            <q-toolbar-title class="absolute-center">
              <h5
                class="text-caption text-center color-white"
                style="margin: 0"
              >
                © {{ firma.firmenName }}
              </h5>
            </q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </q-header>

      <q-scroll-area class="fit">
        <q-list padding class="menu-list q-pt-xl q-mt-lg">
          <q-item
            clickable
            v-ripple
            @click="$router.push(`/`)"
            :class="{ 'text-secondary': isActive('/') }"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section> Startseite </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/speisekarte`)"
            :class="{ 'text-secondary': isActive('/speisekarte') }"
          >
            <q-item-section avatar>
              <q-icon name="restaurant" />
            </q-item-section>

            <q-item-section> Speisekarte </q-item-section>
          </q-item>

          <q-item
            v-if="isLoggedIn"
            clickable
            v-ripple
            @click="$router.push(`/bearbeitung`)"
            :class="{ 'text-secondary': isActive('/bearbeitung') }"
          >
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>

            <q-item-section> Speisekarte bearbeiten </q-item-section>
          </q-item>

          <q-item
            v-if="isLoggedIn"
            clickable
            v-ripple
            @click="$router.push(`/account`)"
            :class="{ 'text-secondary': isActive('/account') }"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section>Account</q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-ripple
            @click="$router.push(`/verwaltung`)"
            :class="{ 'text-secondary': isActive('/verwaltung') }"
          >
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>

            <q-item-section>Account Verwaltung</q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-ripple
            @click="$router.push(`/logs`)"
            :class="{ 'text-secondary': isActive('/logs') }"
          >
            <q-item-section avatar>
              <q-icon name="fingerprint" />
            </q-item-section>

            <q-item-section>User Logs</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/oeffnungszeiten`)"
            :class="{ 'text-secondary': isActive('/oeffnungszeiten') }"
          >
            <q-item-section avatar>
              <q-icon name="schedule" />
            </q-item-section>

            <q-item-section> Öffnungszeiten </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/anfahrt`)"
            :class="{ 'text-secondary': isActive('/anfahrt') }"
          >
            <q-item-section avatar>
              <q-icon name="place" />
            </q-item-section>

            <q-item-section> Anfahrt </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/kontakt`)"
            :class="{ 'text-secondary': isActive('/kontakt') }"
          >
            <q-item-section avatar>
              <q-icon name="contacts" />
            </q-item-section>

            <q-item-section> Kontakt </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/agbs`)"
            :class="{ 'text-secondary': isActive('/agbs') }"
          >
            <q-item-section avatar>
              <q-icon name="fact_check" />
            </q-item-section>

            <q-item-section> AGB's </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push(`/impressum`)"
            :class="{ 'text-secondary': isActive('/impressum') }"
          >
            <q-item-section avatar>
              <q-icon name="article" />
            </q-item-section>

            <q-item-section> Impressum </q-item-section>
          </q-item>

          <q-item
            v-if="isLoggedIn"
            clickable
            v-ripple
            @click="$router.push(`/settingspage`)"
            :class="{ 'text-secondary': isActive('/settingspage') }"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Einstellungen</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="footer bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title
          class="absolute-center column"
          style="display: flex; justify-content: center; align-items: center"
        >
          <h5 class="text-caption text-center color-white" style="margin: 0">
            © {{ firma.firmenName }}
          </h5>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
  <q-dialog v-model="isOpen2"> </q-dialog>
  <cookiesDialog v-if="shouldShowDialog" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import cookiesDialog from "src/pages/Dialog/cookiesDialog.vue";
import { useAuth } from "src/composables/useAuth";
import { useFirmenName } from "src/composables/Firmenname";
import { useLogo } from "src/composables/LogoLoad";

const { isAdmin, checkRole, isLoggedIn } = useAuth();

onMounted(() => {
  checkRole();
});

const isOpen2 = ref(false);

const route = useRoute();
const drawerLeft = ref(false);
const isActive = (path: string) => {
  return route.path === path;
};
const shouldShowDialog = computed(() => {
  return route.path !== "/cookies" && route.path !== "/datenschutzerklaerung";
});

const { firmenName, loadFirmenName } = useFirmenName();
const { loadLogo, logo, getFullImageUrl } = useLogo();

onMounted(async () => {
  await loadFirmenName();
  await loadLogo();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.footerTxt {
  font-size: 16px;
  font-family: "Poppins", serif;
}
.höhe {
  min-height: 100vh;
}
.fixed-separator {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100%;
  z-index: 10;
}
.headerTxt {
  font-family: "Poppins", serif;
  font-size: 20px;
}
.cursor {
  cursor: pointer;
}
.btnWarenkorb {
  max-width: 20%;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

a:visited {
  color: inherit;
  text-decoration: none;
}

.banner {
  background-color: rgba(230, 230, 230);
  text-align: center;
  font-family: sans-serif;
}
h6 {
  float: left;
  margin-top: auto;
  margin-bottom: auto;
}
.my-card {
  max-width: 800px;

  margin-left: auto;
  margin-right: auto;
  box-shadow: 1px 1px 0.8rem rgb(145, 145, 145);
}

@media (max-width: 600px) {
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: bottom;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }
  .fixed-separator {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    margin-bottom: 0px;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
