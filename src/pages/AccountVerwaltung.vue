<template>
  <div class="sticky-tabs">
    <q-banner class="banner full-width text-accent">
      <h6 class="bannerText">
        <q-icon class="bannerIcon" name="admin_panel_settings" />
        Benutzerverwaltung
      </h6>
    </q-banner>

    <div class="above bg-white">
      <q-separator color="accent" />
      <h2 class="textOben text-h5 text-weight-thin text-center">
        Alle Benutzer verwalten...
      </h2>
      <q-separator size="15px" color="grey-6" class="separatorOben" />
    </div>
  </div>

  <q-card class="background-img q-mb-md"></q-card>
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
          @click="fetchAllUsers"
          class="q-mt-md"
        />
      </div>

      <div v-else class="users-management">
        <div
          class="text-subtitle text-secondary text-center q-mb-lg row items-center justify-center"
        >
          <q-icon name="people" color="secondary" size="xs" class="q-mr-sm" />
          <span>{{ filteredUsers.length }} Benutzer gefunden</span>
        </div>

        <q-input
          v-model="searchQuery"
          label="Benutzer suchen..."
          filled
          class="q-mb-md"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          rows-per-page-label="Benutzer pro Seite"
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          class="users-table"
          flat
          bordered
          :grid="$q.screen.lt.md"
        >
          <template v-slot:item="props">
            <q-card class="q-ma-sm q-pa-sm full-width">
              <q-card-section>
                <div class="text-subtitle1 text-bold">
                  {{ props.row.username }}
                </div>
                <div class="text-caption">Id: {{ props.row.id }}</div>
                <div
                  class="text-caption"
                  v-if="props.row.firstName || props.row.lastName"
                >
                  Name: {{ props.row.firstName }} {{ props.row.lastName }}
                </div>
                <div class="text-caption">E-Mail: {{ props.row.email }}</div>
                <div class="text-caption">
                  Telefon: {{ props.row.telephone }}
                </div>
                <div class="text-caption">
                  Rolle:
                  <q-badge
                    :color="props.row.role === 1 ? 'negative' : 'primary'"
                    :label="props.row.role"
                  />
                </div>
              </q-card-section>

              <q-separator spaced />

              <q-card-actions vertical align="center" class="q-gutter-sm">
                <q-btn
                  class="full-width"
                  icon="edit"
                  label="Bearbeiten"
                  color="secondary"
                  @click="editUser(props.row)"
                />

                <q-btn
                  class="full-width"
                  icon="password"
                  label="Passwort ändern"
                  color="secondary"
                  @click="changeUserPassword(props.row)"
                />

                <q-btn
                  class="full-width"
                  icon="delete"
                  label="Löschen"
                  color="negative"
                  @click="deleteUser(props.row)"
                  v-if="props.row.role === 0"
                />
              </q-card-actions>
            </q-card>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.role === 1 ? 'negative' : 'primary'"
                :label="props.row.role"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="secondary"
                size="md"
                flat
                round
                @click="editUser(props.row)"
                class="q-mr-xs"
              >
                <q-tooltip>Bearbeiten</q-tooltip>
              </q-btn>
              <q-btn
                icon="password"
                color="secondary"
                size="md"
                flat
                round
                @click="changeUserPassword(props.row)"
                class="q-mr-xs"
              >
                <q-tooltip>Passwort ändern</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                size="md"
                flat
                round
                @click="deleteUser(props.row)"
                :disable="props.row.role === 'Admin'"
              >
                <q-tooltip>
                  {{
                    props.row.role === "Admin"
                      ? "Admin kann nicht gelöscht werden"
                      : "Löschen"
                  }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card-section>
    <div style="display: flex; justify-content: center; align-items: center">
      <q-btn
        label="Benutzer hinzufügen"
        icon="person_add"
        class="q-mb-md q-mt-md"
        color="positive"
        @click="addUserDialog()"
      />
    </div>
  </q-card>

  <!-- Benutzer hinzufügen Dialog -->
  <q-dialog v-model="showUserAdd" persistent>
    <q-card class="my-card2 q-pa-md" style="max-width: 900px">
      <q-card-section>
        <div class="text-subtitle text-center q-mt-md">Benutzer hinzufügen</div>

        <q-form
          @submit="handleSubmit"
          @reset="resetForm"
          class="q-gutter-md q-mt-md"
        >
          <q-input
            class="q-mt-md"
            label="Username"
            filled
            v-model="Username"
            hint="Bitte geben Sie Ihren Nutzernamen an."
            :rules="usernameRules"
            lazy-rules
            :disable="isLoading"
          />
          <q-input
            class="q-mt-md"
            label="E-Mail"
            filled
            v-model="Email"
            hint="Bitte geben Sie Ihre Email-Adresse an."
            :rules="emailRules"
            lazy-rules
            :disable="isLoading"
          />

          <q-input
            class="q-mt-md"
            label="Vorname"
            filled
            v-model="Vorname"
            hint="Bitte geben Sie Ihren Vornamen an."
            :rules="usernameRules"
            lazy-rules
            :disable="isLoading"
          />

          <q-input
            class="q-mt-md"
            label="Nachname"
            filled
            v-model="Nachname"
            hint="Bitte geben Sie Ihren Nachnamen an."
            :rules="usernameRules"
            lazy-rules
            :disable="isLoading"
          />

          <q-input
            class="q-mt-md"
            label="Telefonnr."
            filled
            v-model="Telefon"
            hint="Bitte geben Sie Ihren Telefonnr. an."
            lazy-rules
            :disable="isLoading"
          />

          <q-input
            class="q-mt-md"
            v-model="Password"
            filled
            label="Passwort"
            :type="isPwd ? 'password' : 'text'"
            hint="Bitte geben Sie ihr Passwort ein."
            :rules="passwordRules"
            lazy-rules
            :disable="isLoading"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            class="q-mt-md"
            v-model="PasswordRepeat"
            filled
            label="Passwort wiederholen"
            :type="isPwd ? 'password' : 'text'"
            hint="Bitte wiederholen Sie ihr Passwort ein."
            :rules="passwordRepeatRules"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div
            class="row q-mt-lg"
            style="display: flex; justify-content: center; align-items: center"
          >
            <q-btn
              class="q-mr-md"
              label="Abbrechen"
              color="negative"
              flat
              :disable="isLoading"
              @click="closeUserAdd"
            />
            <q-btn
              type="submit"
              label="Benutzer hinzufügen"
              icon="person_add"
              color="secondary"
              :loading="isLoading"
              :disable="isLoading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Benutzer bearbeiten Dialog -->
  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div
          class="text-subtitle text-secondary text-center q-mb-sm row items-center justify-center"
        >
          <q-icon name="edit" color="secondary" size="xs" class="q-mr-sm" />
          <span>Benutzer bearbeiten: {{ editingUser?.username }}</span>
        </div>

        <q-form ref="editFormRef" @submit.prevent="saveUserChanges">
          <q-input
            label="Benutzername"
            filled
            v-model="editingUser!.username"
            readonly
            class="q-mt-md"
            hint="Benutzername kann nicht geändert werden"
          >
            <template v-slot:prepend>
              <q-icon name="account_circle" color="primary" />
            </template>
          </q-input>

          <q-input
            label="E-Mail"
            filled
            v-model="editingUser!.email"
            type="email"
            class="q-mt-md"
            :rules="[(val) => !!val || 'E-Mail ist erforderlich']"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Vorname"
            filled
            v-model="editingUser!.firstName"
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Nachname"
            filled
            v-model="editingUser!.lastName"
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" color="primary" />
            </template>
          </q-input>

          <q-input
            label="Telefonnummer"
            filled
            v-model="editingUser!.telephone"
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="primary" />
            </template>
          </q-input>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn
              label="Abbrechen"
              flat
              color="negative"
              @click="showEditDialog = false"
              :disable="editLoading"
            />
            <q-btn
              type="submit"
              label="Änderungen speichern"
              color="secondary"
              :loading="editLoading"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Passwort ändern Dialog -->
  <q-dialog v-model="showPasswordDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div
          class="text-subtitle text-secondary text-center q-mb-sm row items-center justify-center"
        >
          <q-icon
            name="lock_reset"
            color="secondary"
            size="xs"
            class="q-mr-sm"
          />
          <span>Passwort ändern für: {{ passwordUser?.username }}</span>
        </div>

        <q-form ref="passwordFormRef" @submit.prevent="submitPasswordChange">
          <q-input
            v-model="passwordForm.newPassword"
            type="password"
            label="Neues Passwort"
            filled
            class="q-mb-md"
            :rules="[
              (val) => !!val || 'Neues Passwort ist erforderlich',
              (val) =>
                val.length >= 6 ||
                'Passwort muss mindestens 6 Zeichen lang sein',
            ]"
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
            :rules="[
              (val) => !!val || 'Passwort-Bestätigung ist erforderlich',
              (val) =>
                val === passwordForm.newPassword ||
                'Passwörter stimmen nicht überein',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" />
            </template>
          </q-input>

          <q-card-actions align="right" class="q-mt-md">
            <q-btn
              label="Abbrechen"
              flat
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
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Löschbestätigung Dialog -->
  <q-dialog v-model="showDeleteDialog">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm"
          >Benutzer "{{ userToDelete?.username }}" wirklich löschen?</span
        >
      </q-card-section>

      <q-card-section class="q-pt-none">
        Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten des
        Benutzers werden dauerhaft gelöscht.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Abbrechen" color="negative" v-close-popup />
        <q-btn
          label="Löschen"
          color="secondary"
          @click="confirmDeleteUser"
          :loading="deleteLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import type { QForm } from "quasar";
import { useRegister } from "../components/register";

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

// Benutzer hinzufügen
const emailRules = [
  (val: string) => !!val || "E-Mail ist erforderlich",
  (val: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailPattern.test(val) ||
      "Bitte geben Sie eine gültige E-Mail-Adresse ein"
    );
  },
];
const showUserAdd = ref(false);

const onUserAddSuccess = () => {
  showUserAdd.value = false;
  void fetchAllUsers();
};
const {
  Username,
  Email,
  Vorname,
  Nachname,
  Telefon,
  Password,
  PasswordRepeat,
  isPwd,
  isLoading,
  usernameRules,
  passwordRules,
  passwordRepeatRules,
  register,
  resetForm,
} = useRegister(onUserAddSuccess);
const handleSubmit = () => {
  void register();
};
const addUserDialog = () => {
  showUserAdd.value = true;
};

const closeUserAdd = () => {
  resetForm();
  showUserAdd.value = false;
};

const users = ref<UserInfo[]>([]);
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");

// Benutzer bearbeiten Dialog
const showEditDialog = ref(false);
const editingUser = ref<UserInfo | null>(null);
const editLoading = ref(false);
const editFormRef = ref<QForm | null>(null);

// Passwort ändern Dialog
const showPasswordDialog = ref(false);
const passwordUser = ref<UserInfo | null>(null);
const passwordForm = ref({
  newPassword: "",
  confirmNewPassword: "",
});
const passwordLoading = ref(false);
const passwordFormRef = ref<QForm | null>(null);

// Benutzer löschen Dialog
const showDeleteDialog = ref(false);
const userToDelete = ref<UserInfo | null>(null);
const deleteLoading = ref(false);

const columns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "username",
    label: "Benutzername",
    field: "username",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "email",
    label: "E-Mail",
    field: "email",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "firstName",
    label: "Vorname",
    field: "firstName",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "lastName",
    label: "Nachname",
    field: "lastName",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "role",
    label: "Rolle",
    field: "role",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "telephone",
    label: "Telefon",
    field: "telephone",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "actions",
    label: "Aktionen",
    field: "",
    align: "center" as const,
  },
];

const pagination = ref({
  rowsPerPage: 15,
  sortBy: "id",
  descending: false,
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.firstName && user.firstName.toLowerCase().includes(query)) ||
      (user.lastName && user.lastName.toLowerCase().includes(query))
  );
});

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken")
  );
};

const fetchAllUsers = async () => {
  loading.value = true;
  error.value = "";

  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const response = await fetch("http://localhost:5008/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        throw new Error("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
      }
      if (response.status === 403) {
        throw new Error("Keine Berechtigung für diese Aktion.");
      }
      const errorText = await response.text();
      throw new Error(
        `Fehler beim Laden der Benutzerdaten: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    users.value = data;
  } catch (err) {
    console.error("Fehler beim Laden der Benutzerdaten:", err);
    error.value =
      err instanceof Error
        ? err.message
        : "Ein unbekannter Fehler ist aufgetreten";

    if (
      error.value.includes("Nicht angemeldet") ||
      error.value.includes("Sitzung abgelaufen")
    ) {
      setTimeout(() => {
        void router.push("/login");
      }, 2000);
    }
  } finally {
    loading.value = false;
  }
};

// Benutzer bearbeiten
const editUser = (user: UserInfo) => {
  editingUser.value = { ...user };
  showEditDialog.value = true;
};

const saveUserChanges = async () => {
  const isValid = await editFormRef.value?.validate();
  if (!isValid || !editingUser.value) {
    return;
  }

  editLoading.value = true;

  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const response = await fetch(
      `http://localhost:5008/api/users/${editingUser.value.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editingUser.value.email,
          firstName: editingUser.value.firstName,
          lastName: editingUser.value.lastName,
          telephone: editingUser.value.telephone,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Fehler beim Speichern: ${response.status} - ${errorText}`
      );
    }

    const userIndex = users.value.findIndex(
      (u) => u.id === editingUser.value!.id
    );
    if (userIndex !== -1) {
      users.value[userIndex] = { ...editingUser.value };
    }

    $q.notify({
      type: "positive",
      message: "Benutzerdaten erfolgreich aktualisiert",
      position: "top",
    });

    showEditDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Speichern der Benutzerdaten:", err);
    $q.notify({
      type: "negative",
      message:
        err instanceof Error ? err.message : "Fehler beim Speichern der Daten",
      position: "top",
    });
  } finally {
    editLoading.value = false;
  }
};

// Passwort ändern
const changeUserPassword = (user: UserInfo) => {
  passwordUser.value = user;
  passwordForm.value = {
    newPassword: "",
    confirmNewPassword: "",
  };
  showPasswordDialog.value = true;
};

const submitPasswordChange = async () => {
  const isValid = await passwordFormRef.value?.validate();
  if (!isValid || !passwordUser.value) {
    return;
  }

  passwordLoading.value = true;

  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const response = await fetch(
      `http://localhost:5008/api/users/${passwordUser.value.id}/change-password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: passwordForm.value.newPassword,
          confirmNewPassword: passwordForm.value.confirmNewPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        `Fehler beim Ändern des Passworts: ${response.status}`;
      throw new Error(errorMessage);
    }

    $q.notify({
      type: "positive",
      message: `Passwort für ${passwordUser.value.username} erfolgreich geändert`,
      position: "top",
    });

    showPasswordDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Ändern des Passworts:", err);
    $q.notify({
      type: "negative",
      message:
        err instanceof Error ? err.message : "Fehler beim Ändern des Passworts",
      position: "top",
    });
  } finally {
    passwordLoading.value = false;
  }
};

// Benutzer löschen
const deleteUser = (user: UserInfo) => {
  if (user.role === "Admin") {
    $q.notify({
      type: "warning",
      message: "Admin-Benutzer können nicht gelöscht werden",
      position: "top",
    });
    return;
  }

  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;

  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Nicht angemeldet - kein Token gefunden");
    }

    const response = await fetch(
      `http://localhost:5008/api/users/${userToDelete.value.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fehler beim Löschen: ${response.status} - ${errorText}`);
    }

    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id);

    $q.notify({
      type: "positive",
      message: `Benutzer ${userToDelete.value.username} erfolgreich gelöscht`,
      position: "top",
    });

    showDeleteDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Löschen des Benutzers:", err);
    $q.notify({
      type: "negative",
      message:
        err instanceof Error
          ? err.message
          : "Fehler beim Löschen des Benutzers",
      position: "top",
    });
  } finally {
    deleteLoading.value = false;
    userToDelete.value = null;
  }
};

onMounted(async () => {
  await fetchAllUsers();
});
</script>

<style scoped>
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

.users-management {
  max-width: 100%;
}

.users-table {
  margin-top: 1rem;
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
