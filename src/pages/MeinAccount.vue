<template>
  <div class="app-container flex justify-center">
   <!-- 
    <div class="glass-header full-width fixed-top" style="z-index: 10;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">Mein Account</span>
        </div>
      </div>
    </div>
    -->

    <div class="content-wrapper q-px-md">


      <div class="premium-glass-card shadow-24 q-mb-xl">
        <div class="card-inner">
          
          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner-dots color="secondary" size="3em" />
            <p class="text-grey-5 q-mt-md uppercase tracking-wider">Lade Benutzerdaten...</p>
          </div>

          <div v-else-if="error" class="text-center q-pa-xl">
            <q-icon name="error_outline" color="negative" size="4em" />
            <p class="text-negative q-mt-md">{{ error }}</p>
            <q-btn
              color="secondary"
              outline
              label="Erneut versuchen"
              @click="fetchUserData"
              class="q-mt-md luxury-btn-outline"
            />
          </div>

          <div v-else-if="userInfo" class="user-data">
            <div class="text-center q-mb-xl">
              <div class="text-overline text-secondary text-weight-bold">ACCOUNT-INFORMATIONEN</div>
              <div class="text-h5 text-white text-weight-light">{{ userInfo.username }}</div>
            </div>

            <div class="q-gutter-y-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    label="Vorname"
                    dark filled readonly
                    :model-value="userInfo.firstName || 'Nicht angegeben'"
                    class="premium-input"
                  >
                    <template v-slot:prepend><q-icon name="person" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    label="Nachname"
                    dark filled readonly
                    :model-value="userInfo.lastName || 'Nicht angegeben'"
                    class="premium-input"
                  >
                    <template v-slot:prepend><q-icon name="person_outline" /></template>
                  </q-input>
                </div>
              </div>

              <q-input
                label="E-Mail-Adresse"
                dark filled readonly
                v-model="userInfo.email"
                class="premium-input"
              >
                <template v-slot:prepend><q-icon name="email" /></template>
              </q-input>

              <q-input
                label="Telefonnummer"
                dark filled readonly
                :model-value="userInfo.telephone || 'Nicht angegeben'"
                class="premium-input"
              >
                <template v-slot:prepend><q-icon name="phone" /></template>
              </q-input>

              <div class="column q-gutter-y-md q-mt-xl">
                <q-btn
                  label="Profil bearbeiten"
                  icon="edit"
                  color="secondary"
                  class="luxury-btn full-width"
                  @click="showEditUserInfoDialog = true"
                  :text-color="schriftFarbe ? 'white' : 'black'"
                />
                
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-btn
                      label="Passwort ändern"
                      icon="lock_reset"
                      flat
                      class="luxury-btn-flat full-width"
                      @click="changePassword"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-btn
                      label="Account löschen"
                      icon="delete_sweep"
                      flat
                      color="negative"
                      class="luxury-btn-flat full-width"
                      @click="showDeleteDialog = true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-caption text-center q-mb-xl text-grey-6 uppercase tracking-widest">
        Fragen zum Konto? 
        <RouterLink class="text-secondary text-weight-bold no-decoration" to="/kontakt">
          Support kontaktieren
        </RouterLink>
      </div>
    </div>

    <q-dialog v-model="showEditUserInfoDialog" backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 350px">
        <q-card-section class="text-center">
          <div class="text-overline text-secondary">EINSTELLUNGEN</div>
          <div class="text-h6 text-white">Profil bearbeiten</div>
        </q-card-section>

        <q-card-section v-if="userInfo" class="q-gutter-y-sm">
          <q-input dark filled v-model="userInfo.username" label="Benutzername" class="premium-input" />
          <q-input dark filled v-model="userInfo.email" label="E-Mail" class="premium-input" />
          <q-input dark filled v-model="userInfo.firstName" label="Vorname" class="premium-input" />
          <q-input dark filled v-model="userInfo.lastName" label="Nachname" class="premium-input" />
          <q-input dark filled v-model="userInfo.telephone" label="Telefon" class="premium-input" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md flex column ">
          
          <q-btn label="Speichern" color="secondary" class="luxury-btn q-px-lg full-width q-mb-xs" :loading="UserInfoLoading" @click="saveChangesUserinfo" />
        <q-btn flat label="Abbrechen" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPasswordDialog" persistent backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 350px">
        <q-card-section class="text-center">
          <q-icon name="lock_open" color="secondary" size="md" class="q-mb-sm" />
          <div class="text-h6 text-white uppercase tracking-widest">Sicherheit</div>
        </q-card-section>

        <q-form ref="passwordFormRef" @submit.prevent="submitPasswordChange">
          <q-card-section class="q-gutter-y-md">
            <q-input dark filled v-model="passwordForm.currentPassword" type="password" label="Aktuelles Passwort" class="premium-input" :rules="passwordRules.currentPassword" />
            <q-input dark filled v-model="passwordForm.newPassword" type="password" label="Neues Passwort" class="premium-input" :rules="passwordRules.newPassword" />
            <q-input dark filled v-model="passwordForm.confirmNewPassword" type="password" label="Bestätigen" class="premium-input" :rules="passwordRules.confirmNewPassword" />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md flex column">
            
            <q-btn type="submit" label="Ändern" color="secondary" class="luxury-btn q-px-lg full-width q-mb-xs" :loading="passwordLoading" />
            <q-btn flat label="Abbrechen" color="white" @click="showPasswordDialog = false" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog" backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog bg-negative-glass" style="min-width: 320px">
        <q-card-section class="text-center q-pa-xl">
          <q-icon name="warning" color="negative" size="4em" class="q-mb-md" />
          <div class="text-h6 text-white">Account löschen?</div>
          <p class="text-grey-4 q-mt-sm">Dies kann nicht rückgängig gemacht werden.</p>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-xl">
          <q-btn flat label="Abbrechen" color="white" v-close-popup />
          <q-btn label="Endgültig löschen" color="negative" unelevated class="luxury-btn q-px-lg" :loading="deleteLoading" @click="deleteAccount" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import type { QForm } from "quasar";
import api from "src/boot/axios";
import axios from "axios";

interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  telephone?: string;
}

const $q = useQuasar();
const router = useRouter();

const userInfo = ref<UserInfo | null>(null);
const loading = ref(false);
const error = ref("");
const showDeleteDialog = ref(false);
const showEditUserInfoDialog = ref(false);
const deleteLoading = ref(false);

const fetchUserData = async () => {
  loading.value = true;
  error.value = "";

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    console.log("Token gefunden:", token ? "Ja" : "Nein");
    console.log("LocalStorage Inhalt:", localStorage);

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    console.log("API-Aufruf wird gestartet...");
    const apiUrl = "/api/auth/me";
    console.log("API-URL:", api.defaults.baseURL + apiUrl);

    const response = await api.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API-Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    const contentType = response.headers["content-type"];
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const responseText = JSON.stringify(response.data);
      console.error(
        "Unerwartete Antwort (kein JSON):",
        responseText.substring(0, 200)
      );
      throw new Error("Server-Fehler: Unerwartete Antwort erhalten");
    }

    console.log("Benutzerdaten erhalten:", response.data);
    userInfo.value = response.data;
  } catch (err) {
    console.error("Fehler beim Laden der Benutzerdaten:", err);

    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");

        error.value = "Sitzung abgelaufen. Bitte melden Sie sich erneut an.";

        setTimeout(() => {
          void router.push("/login");
        }, 2000);
      } else {
        const errorText =
          err.response?.data?.message || err.response?.statusText;
        error.value = `Fehler beim Laden der Daten: ${err.response?.status} - ${errorText}`;
      }
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Ein unbekannter Fehler ist aufgetreten";
    }
  } finally {
    loading.value = false;
  }
};

// Profil bearbeiten
const UserInfoLoading = ref(false);

const saveChangesUserinfo = async () => {
  UserInfoLoading.value = true;

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const payload = {
      username: userInfo.value?.username,
      firstName: userInfo.value?.firstName,
      lastName: userInfo.value?.lastName,
      email: userInfo.value?.email,
      telephone: userInfo.value?.telephone,
    };

    const response = await api.put("/api/auth/profile", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Benutzerdaten geändert:", response.data);
    userInfo.value = response.data;

    $q.notify({
      type: "positive",
      message: "Profil erfolgreich aktualisiert",
      position: "top",
    });

    showEditUserInfoDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Speichern der Benutzerdaten:", err);

    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");

        $q.notify({
          type: "negative",
          message: "Sitzung abgelaufen. Bitte melden Sie sich erneut an.",
          position: "top",
        });

        setTimeout(() => {
          void router.push("/login");
        }, 2000);
        return;
      }

      const errorText =
        err.response?.data?.message ||
        err.response?.statusText ||
        "Unbekannter Fehler";
      $q.notify({
        type: "negative",
        message: `HTTP ${err.response?.status}: ${errorText}`,
        position: "top",
      });
    } else {
      $q.notify({
        type: "negative",
        message:
          err instanceof Error
            ? err.message
            : "Fehler beim Speichern der Daten",
        position: "top",
      });
    }
  } finally {
    UserInfoLoading.value = false;
  }
};

// Passwort ändern

const showPasswordDialog = ref(false);
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});
const passwordLoading = ref(false);
const passwordFormRef = ref<QForm | null>(null);

const passwordRules = {
  currentPassword: [
    (val: string) => !!val || "Aktuelles Passwort ist erforderlich",
  ],
  newPassword: [
    (val: string) => !!val || "Neues Passwort ist erforderlich",
    (val: string) =>
      val.length >= 6 || "Passwort muss mindestens 6 Zeichen lang sein",
  ],
  confirmNewPassword: [
    (val: string) => !!val || "Passwort-Bestätigung ist erforderlich",
    (val: string) =>
      val === passwordForm.value.newPassword ||
      "Passwörter stimmen nicht überein",
  ],
};

const changePassword = () => {
  passwordForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  showPasswordDialog.value = true;
};

const submitPasswordChange = async () => {
  const isValid = await passwordFormRef.value?.validate();
  if (!isValid) {
    return;
  }

  passwordLoading.value = true;

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const payload = {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmNewPassword: passwordForm.value.confirmNewPassword,
    };

    const response = await api.post("/api/auth/change-password", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Password changed successfully:", response.data);

    $q.notify({
      type: "positive",
      message: "Passwort erfolgreich geändert",
      position: "top",
    });

    showPasswordDialog.value = false;

    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  } catch (err) {
    console.error("Fehler beim Ändern des Passworts:", err);

    let message =
      err instanceof Error ? err.message : "Fehler beim Ändern des Passworts";

    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        message = "Sitzung abgelaufen. Bitte melden Sie sich erneut an.";

        setTimeout(() => {
          void router.push("/login");
        }, 2000);
      } else if (errorMsg) {
        message = errorMsg;
      }
    }

    $q.notify({
      type: "negative",
      message,
      position: "top",
    });
  } finally {
    passwordLoading.value = false;
  }
};

// Account löschen

const deleteAccount = async () => {
  deleteLoading.value = true;

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const apiUrl = "/api/auth/me";
    console.log("API-URL für Löschung:", apiUrl);

    const response = await api.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete Response Status:", response.status);

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    localStorage.clear();

    $q.notify({
      type: "positive",
      message: "Account erfolgreich gelöscht",
      position: "top",
    });

    setTimeout(() => {
      void router.push("/login");
    }, 500);
  } catch (err) {
    console.error("Fehler beim Löschen des Accounts:", err);

    let message =
      err instanceof Error ? err.message : "Fehler beim Löschen des Accounts";

    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const errorText = err.response?.data?.message || err.response?.data;

      if (status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        message = "Sitzung abgelaufen. Bitte melden Sie sich erneut an.";

        setTimeout(() => {
          void router.push("/login");
        }, 2000);
      } else if (errorText) {
        message = `Fehler beim Löschen des Accounts: ${status} - ${errorText}`;
      }
    }

    $q.notify({
      type: "negative",
      message,
      position: "top",
    });
  } finally {
    deleteLoading.value = false;
    showDeleteDialog.value = false;
  }
};

//Schriftfarbe laden
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
  await fetchUserData();
  await loadSchriftFarbe();
});
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
  margin-top: -20px;
}

.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  top: 53px;
}

.logo-dot {
  width: 10px; height: 10px;
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

.premium-glass-card-dialog {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.card-inner {
  padding: 40px 30px;
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05) !important;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: bold;
  height: 55px;
  box-shadow: 0 4px 15px rgba(var(--q-secondary), 0.3);
}

.luxury-btn-flat {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: white;
  height: 50px;
}

.luxury-btn-outline {
  border: 1px solid var(--q-secondary);
  border-radius: 12px;
}

.tracking-widest { letter-spacing: 3px; }
.uppercase { text-transform: uppercase; }
.no-decoration { text-decoration: none; }
.opacity-2 { opacity: 0.1; }

@media (max-width: 600px) {
  .card-inner { padding: 30px 20px; }
  .content-wrapper { padding-top: 100px; }
  .text-h4 { font-size: 1.8rem; }
}
</style>
