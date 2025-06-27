<template>
  <div class="sticky-tabs">
    <q-banner class="banner full-width text-accent">
      <h6 class="bannerText">
        <q-icon class="bannerIcon" name="person" />
        Account
      </h6>
    </q-banner>

    <div class="above bg-white">
      <q-separator color="accent" />
      <h2 class="textOben text-h5 text-weight-thin text-center">
        Mein Account...
      </h2>
      <q-separator size="15px" color="grey-6" class="separatorOben" />
    </div>
  </div>

  <q-card class="background-img"></q-card>
  <q-card class="my-card2 q-mt-md">
    <q-card-section>
      <div v-if="loading" class="text-center">
        <q-spinner-dots color="primary" size="2em" />
        <p class="q-mt-md">Lade Benutzerdaten...</p>
      </div>

      <div v-else-if="error" class="text-center">
        <q-icon name="error" color="negative" size="3em" />
        <p class="text-negative q-mt-md">{{ error }}</p>
        <q-btn
          color="secondary"
          label="Erneut versuchen"
          @click="fetchUserData"
          class="q-mt-md"
        />
      </div>

      <div v-else-if="userInfo" class="user-data">
        <div
          class="text-subtitle text-secondary text-center q-mb-lg row items-center justify-center"
        >
          <q-icon name="person" color="secondary" size="xs" class="q-mr-sm" />
          <span>Account-Informationen</span>
        </div>
        <q-btn
          label="Profil bearbeiten"
          icon="edit"
          color="secondary"
          class="full-width"
          @click="showEditUserInfoDialog = true"
        />

        <div class="user-info-grid">
          <q-input
            label="Benutzername"
            filled
            v-model="userInfo.username"
            readonly
            class="q-mt-md"
            hint="Ihr Benutzername"
          >
            <template v-slot:prepend>
              <q-icon name="account_circle" color="primary" />
            </template>
          </q-input>

          <q-input
            label="E-Mail"
            filled
            v-model="userInfo.email"
            readonly
            class="q-mt-md"
            hint="Ihre E-Mail-Adresse"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Vorname"
            filled
            :model-value="userInfo.firstName || 'Nicht angegeben'"
            readonly
            class="q-mt-md"
            hint="Ihr Vorname"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Nachname"
            filled
            :model-value="userInfo.lastName || 'Nicht angegeben'"
            readonly
            class="q-mt-md"
            hint="Ihr Nachname"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Telefonnr."
            filled
            :model-value="userInfo.telephone || 'Nicht angegeben'"
            readonly
            class="q-mt-md"
            hint="Ihre Telefonnummer"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="action-buttons q-mt-lg">
          <q-btn
            label="Passwort ändern"
            icon="password"
            color="secondary"
            class="full-width"
            @click="changePassword"
          />
          <q-btn
            label="Account löschen"
            icon="delete"
            color="negative"
            class="full-width"
            @click="showDeleteDialog = true"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- Profil bearbeiten -->
  <q-dialog v-model="showEditUserInfoDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div
          class="text-subtitle text-secondary text-center q-mb-sm row items-center justify-center"
        >
          <q-icon
            name="manage_accounts"
            color="secondary"
            size="xs"
            class="q-mr-sm"
          />
          <span>Account-Informationen bearbeiten</span>
        </div>
        <div v-if="userInfo" class="user-data">
          <div class="user-info-grid">
            <q-input
              label="Benutzername"
              readonly
              filled
              v-model="userInfo.username"
              class="q-mt-md"
              hint="Ihr Benutzername ändern"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" color="primary" />
              </template>
            </q-input>

            <q-input
              label="E-Mail"
              filled
              v-model="userInfo.email"
              class="q-mt-md"
              hint="Ihre E-Mail-Adresse ändern"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input
              label="Vorname"
              filled
              v-model="userInfo.firstName"
              class="q-mt-md"
              hint="Ihr Vorname ändern"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              label="Nachname"
              filled
              v-model="userInfo.lastName"
              class="q-mt-md"
              hint="Ihr Nachname ändern"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" color="primary" />
              </template>
            </q-input>

            <q-input
              label="Telefonnr."
              filled
              v-model="userInfo.telephone"
              class="q-mt-md"
              hint="Ihre Telefonnummer ändern"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" color="primary" />
              </template>
            </q-input>
            <div>
              <q-card-actions align="right" class="text-primary q-mt-md">
                <q-btn
                  label="abbrechen"
                  flat
                  color="negative"
                  @click="showEditUserInfoDialog = false"
                />
                <q-btn
                  @click="saveChangesUserinfo"
                  label="Änderungen Speichern"
                  color="secondary"
                  :loading="UserInfoLoading"
                />
              </q-card-actions>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Account löschen -->
  <q-dialog v-model="showDeleteDialog">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm">Account wirklich löschen?</span>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten
        werden dauerhaft gelöscht.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Abbrechen" color="negative" v-close-popup />
        <q-btn
          label="Löschen"
          color="secondary"
          @click="deleteAccount"
          :loading="deleteLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Passwort ändern -->
  <q-dialog v-model="showPasswordDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-avatar icon="lock" color="primary" text-color="white" />
        <span class="q-ml-sm text-h6">Passwort ändern</span>
      </q-card-section>

      <q-form ref="passwordFormRef" @submit.prevent="submitPasswordChange">
        <q-card-section class="q-pt-none">
          <input
            type="text"
            :value="userInfo?.username || ''"
            autocomplete="username"
            style="display: none"
            readonly
          />
          <q-input
            v-model="passwordForm.currentPassword"
            type="password"
            label="Aktuelles Passwort"
            filled
            class="q-mb-md"
            :rules="passwordRules.currentPassword"
            autocomplete="current-password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input
            v-model="passwordForm.newPassword"
            type="password"
            label="Neues Passwort"
            filled
            class="q-mb-md"
            :rules="passwordRules.newPassword"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
          </q-input>

          <q-input
            v-model="passwordForm.confirmNewPassword"
            type="password"
            label="Neues Passwort bestätigen"
            filled
            :rules="passwordRules.confirmNewPassword"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Abbrechen"
            color="negative"
            @click="showPasswordDialog = false"
            :disable="passwordLoading"
          />
          <q-btn
            type="submit"
            label="Passwort ändern"
            color="secondary"
            :loading="passwordLoading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
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

onMounted(async () => {
  await fetchUserData();
});
</script>

<style>
.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/uhr.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}

.my-card2 {
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  width: 98%;
  box-shadow: 1px 1px 0.6rem rgb(0, 0, 0);
  border: 2px solid;
  border-color: #6e6e6e;
  max-height: auto;
  margin-bottom: 40px;
}

.bannerIcon {
  size: 30px;
}

.sticky-tabs {
  position: sticky;
  top: 52px;
  z-index: 1;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-data {
  max-width: 100%;
}

.user-info-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 600px) {
  .my-card2 {
    padding: 0;
    margin-bottom: 0;
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
}
</style>
