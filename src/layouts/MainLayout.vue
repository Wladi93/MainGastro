<template>
  <q-layout view="hHh lpr fFf" v-for="firma in firmenName" :key="firma.id" class="app-layout">
    
    <q-header class="text-white glass-header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawerLeft = !drawerLeft" color="white" />
        <q-toolbar-title
          @click="$router.push(`/`)"
          class="cursor headerTxt q-mr-xl text-white"
          align="center"
          style="overflow: visible; display: flex; justify-content: center;"
        >
          <q-img style="width: 180px; height: auto; max-height: 50px;" 
                 v-for="logos in logo.filter((item) => item.id === 1)"
                 :key="logos.id"
                 :src="getFullImageUrl(logos.url)">
          </q-img>
        </q-toolbar-title>
        <q-btn flat round icon="shopping_cart" @click="openWarenkorb" color="white">
          <q-badge v-show="totalItemCount > 0" :label="totalItemCount" class="q-mt-xs" color="secondary" floating rounded></q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      side="left"
      :breakpoint="500"
      overlay
      behavior="mobile"
      class="glass-drawer"
    >
      <div class="column no-wrap full-height">
        
        <div class="drawer-header-fixed">
          <q-toolbar class="q-py-sm">
            <q-btn dense flat round icon="close" @click="drawerLeft = false" color="white" />
            <q-toolbar-title class="headerTxt absolute-center">
              <q-img style="width: 150px; height: auto;"
                     v-for="logos in logo.filter((item) => item.id === 1)"
                     :key="logos.id"
                     :src="getFullImageUrl(logos.url)">
              </q-img>
            </q-toolbar-title>
          </q-toolbar>
        </div>

        <q-scroll-area class="col text-white">
          <q-list padding class="menu-list q-px-sm">
            
            <q-item clickable v-ripple @click="$router.push(`/`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/') }">
              <q-item-section avatar><q-icon name="home" /></q-item-section>
              <q-item-section> Startseite </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/warenkorb`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/warenkorb') }">
              <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
              <q-item-section> Warenkorb </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/speisekarte`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/speisekarte') }">
              <q-item-section avatar><q-icon name="restaurant" /></q-item-section>
              <q-item-section> Speisekarte </q-item-section>
            </q-item>

            <q-item v-if="isLoggedIn" clickable v-ripple @click="$router.push(`/bearbeitung`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/bearbeitung') }">
              <q-item-section avatar><q-icon name="edit" /></q-item-section>
              <q-item-section> Speisekarte bearbeiten </q-item-section>
            </q-item>

            <q-item v-if="firma.lieferando" clickable v-ripple @click="openLieferando(firma.lieferando)" class="menu-item-glass">
              <q-item-section avatar><q-icon name="takeout_dining" /></q-item-section>
              <q-item-section> Lieferando </q-item-section>
            </q-item>

            <q-item v-if="isLoggedIn" clickable v-ripple @click="$router.push(`/account`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/account') }">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>Account</q-item-section>
            </q-item>

            <q-item v-if="isAdmin" clickable v-ripple @click="$router.push(`/verwaltung`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/verwaltung') }">
              <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
              <q-item-section>Account Verwaltung</q-item-section>
            </q-item>

<q-item v-if="isAdmin" clickable v-ripple @click="$router.push(`/logs`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/logs') }">
  <q-item-section avatar>
    <q-icon name="fingerprint" /> </q-item-section>
  <q-item-section>User Logs</q-item-section>
</q-item>

            <q-item clickable v-ripple @click="$router.push(`/oeffnungszeiten`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/oeffnungszeiten') }">
              <q-item-section avatar><q-icon name="schedule" /></q-item-section>
              <q-item-section> Öffnungszeiten </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/anfahrt`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/anfahrt') }">
              <q-item-section avatar><q-icon name="place" /></q-item-section>
              <q-item-section> Anfahrt </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/kontakt`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/kontakt') }">
              <q-item-section avatar><q-icon name="contacts" /></q-item-section>
              <q-item-section> Kontakt </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/agbs`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/agbs') }">
              <q-item-section avatar><q-icon name="fact_check" /></q-item-section>
              <q-item-section> AGB's </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="$router.push(`/impressum`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/impressum') }">
              <q-item-section avatar><q-icon name="article" /></q-item-section>
              <q-item-section> Impressum </q-item-section>
            </q-item>

            <q-item v-if="isLoggedIn" clickable v-ripple @click="$router.push(`/settingspage`)" class="menu-item-glass" :class="{ 'text-secondary item-active': isActive('/settingspage') }">
              <q-item-section avatar><q-icon name="settings" /></q-item-section>
              <q-item-section>Einstellungen</q-item-section>
            </q-item>

            <q-item class="full-width q-mt-md q-mb-lg">
              <q-item-section>
                <q-btn v-if="isLoggedIn" size="md" class="glass-btn full-width" label="Logout" unelevated color="negative" icon="logout" @click="logout" />
                <q-btn v-else size="md" class="glass-btn full-width" label="Login" unelevated color="secondary" icon="login" @click="$router.push('/login')" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="drawer-footer-fixed q-pa-md">
          <div class="text-caption text-center text-grey-5">
            © {{ firma.firmenName }}
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="glass-footer text-white">
      <q-toolbar>
        <q-toolbar-title class="absolute-center column">
          <h5 class="text-caption text-center text-grey-5" style="margin: 0">© {{ firma.firmenName }}</h5>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
  <WarenkorbBadgeDialog v-model:isOpen="isOpen" />
  <cookiesDialog v-if="shouldShowDialog" />
</template>

<script setup lang="ts">
/* --- 100% UNVERÄNDERTE LOGIK --- */
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import cookiesDialog from "src/pages/Dialog/cookiesDialog.vue";
import { useAuth } from "src/composables/useAuth";
import { useFirmenName } from "src/composables/Firmenname";
import { useLogo } from "src/composables/LogoLoad";
import { useCartStore } from "src/store/cardStore";
import WarenkorbBadgeDialog from "src/pages/Dialog/WarenkorbBadgeDialog.vue";

const { isAdmin, checkRole, isLoggedIn } = useAuth();

onMounted(() => {
  checkRole();
});

const route = useRoute();
const router = useRouter();
const drawerLeft = ref(false);
const isActive = (path: string) => {
  return route.path === path;
};
const shouldShowDialog = computed(() => {
  return route.path !== "/cookies" && route.path !== "/datenschutzerklaerung";
});

const { firmenName, loadFirmenName } = useFirmenName();
const { loadLogo, logo, getFullImageUrl } = useLogo();

const openLieferando = (url: string) => {
  window.open(url, "_blank");
};

async function logout() {
  localStorage.removeItem("authToken");
  await router.push("/");
  location.reload();
}

//Badge#
const isOpen = ref(false);
function openWarenkorb() {
  isOpen.value = true;
}
const cartStore = useCartStore();
const genericCartItems = cartStore.genericCartItems;
const totalItemCount = computed(() => {
  const itemCountCartItems = genericCartItems.reduce(
    (sum, item) => (item.quantity > 0 ? sum + item.quantity : sum),
    0
  );

  return itemCountCartItems;
});

onMounted(async () => {
  await loadFirmenName();
  await loadLogo();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

/* --- GLOBAL APP BACKGROUND (Wie Code 1) --- */
.app-layout {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  font-family: "Poppins", serif;
  color: white;
}

.q-page-container {
  padding-top: 0px !important; /* Exakt die Höhe deines Headers */
}

/* --- GLASS HEADER --- */
.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  height: 60px; /* Optional fixierte Höhe */
}

/* --- GLASS FOOTER --- */
.glass-footer {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: static;
  margin-top: auto;
}

/* --- GLASS DRAWER --- */
/* Wir nutzen :deep, um die interne Quasar-Klasse .q-drawer zu überschreiben */
:deep(.q-drawer) {
  background: rgba(15, 15, 15, 0.95) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-drawer .q-scroll-area {
    color: white;
}

/* --- MENU ITEMS --- */
.menu-item-glass {
    color: #888;
    border-radius: 12px;
    margin: 4px 8px;
    transition: all 0.3s ease;
}

.menu-item-glass:hover {
    background: rgba(255,255,255,0.05);
    color: white;
}

.item-active {
    background: rgba(255,255,255,0.08);
    color: var(--q-secondary) !important;
    font-weight: 600;
}

/* --- UTILS & TEXT --- */
.headerTxt {
  font-family: "Poppins", serif;
  font-size: 20px;
  letter-spacing: 0.5px;
}

.cursor {
  cursor: pointer;
}

/* Buttons im Glas-Stil anpassen */
.glass-btn {
    border-radius: 12px;
    font-weight: 600;
}

/* Links */
a:visited {
  color: inherit;
  text-decoration: none;
}

/* Scrollbars unsichtbar machen für cleaneren Look */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #050505; 
}
::-webkit-scrollbar-thumb {
  background: #333; 
  border-radius: 3px;
}
html, body {
  background: #050505 !important; /* Gleiche Farbe wie dein Layout-Start */
}

.drawer-header-fixed {
  position: sticky;
  top: 0;
  z-index: 20; /* Liegt über der Scroll-Area */
  
  /* Dunkler, transparenter Hintergrund */
  background: rgba(10, 10, 10, 0.75) !important; 
  
  /* Der Blur-Effekt (Wichtig für iPhone Safari) */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  /* Dezente Trennlinie */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Sicherstellen, dass die Scroll-Area direkt darunter beginnt */
.glass-drawer .q-scroll-area {
  height: calc(100% - 70px); /* Höhe abzüglich Header-Höhe */
}

/* Optionale Verschönerung für den Drawer-Hintergrund selbst */
:deep(.q-drawer) {
  background: rgba(5, 5, 5, 0.9) !important;
}

</style>