<template>
  <div class="app-container flex" style="justify-content: center;">
    <!--
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder">LOGIN</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">
      <div class="premium-glass-card login-card shadow-24">
        <div class="card-inner column">
          
          <div class="text-center q-mb-lg">
            <div class="text-overline text-secondary text-weight-bold">WILLKOMMEN ZURÜCK</div>
            <div class="text-h4 text-white text-weight-bolder">Anmelden</div>
          </div>

          <q-form
            @submit="loginCaptcha"
            @reset="resetFormCpatcha"
            class="q-gutter-y-md"
          >
            <q-input
              v-model="Username"
              label="Username"
              class="search-glass custom-input"
              dark
              borderless
              :rules="usernameRules"
              lazy-rules
              :disable="isLoading"
              autocomplete="username"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="secondary" />
              </template>
            </q-input>

            <q-input
              v-model="Password"
              label="Passwort"
              class="search-glass custom-input"
              dark
              borderless
              :type="isPwd ? 'password' : 'text'"
              :rules="passwordRules"
              lazy-rules
              :disable="isLoading"
              autocomplete="current-password"
              @keyup.enter="loginCaptcha"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="secondary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="recaptcha-wrapper q-mt-md">
              <div ref="recaptchaElement" class="recaptcha"></div>
            </div>

            <div class="column q-gutter-y-sm q-mt-md">
              <q-btn
                type="submit"
                label="Login"
                color="secondary"
                unelevated
                class="premium-btn text-weight-bold"
                :loading="isLoading"
                :disable="isLoading"
              />

              <q-btn
                type="reset"
                label="zurücksetzen"
                flat
                color="grey-5"
                class="text-weight-bold"
                :disable="isLoading"
              />
            </div>
          </q-form>

          <div class="text-caption text-center q-mt-xl text-grey-5">
            Noch keinen Account? 
            <RouterLink class="text-secondary text-weight-bold no-decoration" to="/register">
              Registrieren
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { useLogin } from "../components/login";

const {
  Username,
  Password,
  isPwd,
  isLoading,
  usernameRules,
  passwordRules,
  login,
  resetForm,
} = useLogin();

const recaptchaElement = ref<HTMLElement>();
let recaptchaWidget: number | null = null;
const recaptchaToken = ref("");

onMounted(async () => {
  await loadRecaptcha();
  await nextTick();
  renderRecaptcha();
});

const loadRecaptcha = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    (window as unknown as { onRecaptchaLoad: () => void }).onRecaptchaLoad = () => { resolve(); };
    document.head.appendChild(script);
  });
};

const renderRecaptcha = () => {
  if (window.grecaptcha && window.grecaptcha.render && recaptchaElement.value) {
    try {
      recaptchaWidget = window.grecaptcha.render(recaptchaElement.value, {
        sitekey: "6Leua9ErAAAAABZ2GePLkIyZbJCiS_pb_8eryXZf",
        size: "normal",
        theme: "dark", // Passend zum neuen Design
        callback: (token: string) => { recaptchaToken.value = token; },
        "expired-callback": () => { recaptchaToken.value = ""; },
      });
    } catch (error) {
      console.error("Fehler beim Rendern des reCAPTCHA:", error);
    }
  }
};

const loginCaptcha = async () => {
  if (!recaptchaToken.value) return;
  await login(recaptchaToken.value);
};

const resetFormCpatcha = () => {
  resetForm();
  if (recaptchaWidget !== null && window.grecaptcha) {
    window.grecaptcha.reset(recaptchaWidget);
    recaptchaToken.value = "";
  }
};

declare global {
  interface Window { 
    grecaptcha: {
      render: (element: HTMLElement, options: {
        sitekey: string;
        size: string;
        theme: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
      }) => number;
      reset: (widgetId: number) => void;
    };
  }
}
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
  border-top: none;
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
  padding: 40px 30px;
}

.search-glass {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 15px !important;
  padding: 5px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.search-glass:focus-within {
  border-color: var(--q-secondary);
  background: rgba(255, 255, 255, 0.08) !important;
}

.premium-btn {
  height: 55px;
  border-radius: 15px;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.recaptcha-wrapper {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.no-decoration {
  text-decoration: none;
}

@media (max-width: 600px) {
  .card-inner {
    padding: 30px 20px;
  }
  .text-h4 {
    font-size: 1.8rem;
  }
}
</style>