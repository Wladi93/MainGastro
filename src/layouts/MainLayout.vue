<template>
  <q-layout view="hHh lpr fff" v-for="firma in firmenName" :key="firma.id">
    <q-header class="text-white header gradient-header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="drawerLeft = !drawerLeft" />
        <q-toolbar-title
          @click="$router.push(`/`)"
          class="cursor headerTxt q-mr-xl"
          align="center"
          style="overflow: visible"
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
        <q-btn flat round icon="shopping_cart" @click="openWarenkorb">
          <q-badge
            v-show="totalItemCount > 0"
            :label="totalItemCount"
            class="q-mt-xs"
            color="negative"
            floating
            rounded
          ></q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      side="left"
      :breakpoint="500"
      overlay
      behavior="mobile"
      ><q-header class="text-white gradient-header">
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
        <q-footer reveal class="text-white gradient-footer">
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
            @click="$router.push(`/warenkorb`)"
            :class="{ 'text-secondary': isActive('/warenkorb') }"
          >
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section> Warenkorb </q-item-section>
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
            v-if="firma.lieferando"
            clickable
            v-ripple
            @click="openLieferando(firma.lieferando)"
          >
            <q-item-section avatar>
              <q-icon name="takeout_dining" />
            </q-item-section>

            <q-item-section> Lieferando </q-item-section>
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
          <q-item class="full-width">
            <q-item-section>
              <q-btn
                v-if="isLoggedIn"
                size="md"
                class="banner full-wdith"
                label="Logout"
                color="negative"
                icon="logout"
                @click="logout"
              />
              <q-btn
                v-else
                size="md"
                class="banner full-wdith"
                label="Login"
                color="secondary"
                icon="logout"
                @click="$router.push('/login')"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="footer text-white gradient-footer">
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
  <WarenkorbBadgeDialog v-model:isOpen="isOpen" />
  <cookiesDialog v-if="shouldShowDialog" />
</template>

<script setup lang="ts">
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

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.gradient-header {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--q-primary) 95%, white 10%) 0%,
    color-mix(in srgb, var(--q-primary) 100%, white 10%) 25%,
    var(--q-primary) 70%,

    color-mix(in srgb, var(--q-primary) 100%, white 10%) 100%
  );
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.gradient-footer {
  background: linear-gradient(
    35deg,
    color-mix(in srgb, var(--q-primary) 100%, white 0%) 0%,
    color-mix(in srgb, var(--q-primary) 100%, white 4%) 5%,
    var(--q-primary) 70%,

    color-mix(in srgb, var(--q-primary) 100%, white 20%) 90%
  );
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 100%
  );
  pointer-events: none;
}
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
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }
  .q-drawer .q-list {
    padding-bottom: 80px;
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
