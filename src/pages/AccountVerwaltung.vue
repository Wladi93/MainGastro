<template>
  <div class="app-container flex justify-center">
    <!-- <div class="glass-header full-width fixed-top" style="z-index: 10;">
      <div class="row justify-between items-center q-px-md q-py-md">
        <div class="row items-center full-width">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder uppercase">Benutzerverwaltung</span>
        </div>
      </div>
    </div> -->

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
              @click="fetchAllUsers"
              class="q-mt-md luxury-btn-outline"
            />
          </div>

          <div v-else class="users-management">
            <div class="text-center q-mb-lg">
              <div class="text-overline text-secondary text-weight-bold uppercase tracking-widest">
                System-Administration
              </div>
              <div class="text-h5 text-white text-weight-light">
                {{ filteredUsers.length }} Benutzer gefunden
              </div>
            </div>

            <q-input
              v-model="searchQuery"
              label="Benutzer suchen..."
              dark
              filled
              class="premium-input q-mb-lg"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" color="secondary" />
              </template>
            </q-input>

            <q-table
              rows-per-page-label="Benutzer pro Seite"
              :rows="filteredUsers"
              :columns="columns"
              row-key="id"
              v-model:pagination="pagination"
              :rows-per-page-options="[10, 20, 30, 40, 50, 0]"
              class="users-table-glass"
              flat
              dark
              :grid="$q.screen.lt.md"
            >
              <template v-slot:body-cell-role="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.row.role === 1 ? 'negative' : 'secondary'"
                    :label="props.row.role === 1 ? 'Admin' : 'User'"
                    class="q-pa-xs"
                  />
                </q-td>
              </template>

              <template #body-cell-username="props">
                <q-td :props="props">
                  <q-chip
                    outline
                    text-color="white"
                    :color="props.row.username === 'admin' ? 'red-12' : 'secondary'"
                  >
                    {{ props.row.username }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-xs">
                  <q-btn icon="edit" color="secondary" flat round size="sm" @click="editUser(props.row)">
                    <q-tooltip>Bearbeiten</q-tooltip>
                  </q-btn>
                  <q-btn icon="password" color="secondary" flat round size="sm" @click="changeUserPassword(props.row)">
                    <q-tooltip>Passwort ändern</q-tooltip>
                  </q-btn>
                  <q-btn 
                    icon="delete" 
                    color="negative" 
                    flat 
                    round 
                    size="sm" 
                    @click="deleteUser(props.row)"
                    v-if="props.row.id != 1"
                  >
                    <q-tooltip>Löschen</q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6">
                  <q-card class="premium-glass-card-dialog q-pa-sm">
                    <q-card-section>
                      <div class="row justify-between items-center">
                        <q-chip color="secondary" text-color="dark" dense >
                          {{ props.row.username }}
                        </q-chip>
                        <q-badge :color="props.row.role === 1 ? 'negative' : 'accent'">
                          {{ props.row.role === 1 ? 'Admin' : 'User' }}
                        </q-badge>
                      </div>
                      <div class="text-caption text-grey-4 q-mt-sm">ID: {{ props.row.id }}</div>
                      <div class="text-white">{{ props.row.firstName }} {{ props.row.lastName }}</div>
                      <div class="text-grey-5">{{ props.row.email }}</div>
                    </q-card-section>
                    <q-separator dark />
                    <q-card-actions align="right">
                      <q-btn flat icon="edit" color="secondary" @click="editUser(props.row)" />
                      <q-btn flat icon="password" color="secondary" @click="changeUserPassword(props.row)" />
                      <q-btn flat icon="delete" color="negative" @click="deleteUser(props.row)" v-if="props.row.id != 1" />
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </q-table>

            <div class="flex justify-center q-mt-xl">
              <q-btn
                label="Benutzer hinzufügen"
                icon="person_add"
                class="luxury-btn q-px-xl"
                color="secondary"
                @click="addUserDialog()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showUserAdd" persistent backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 400px; max-width: 900px">
        <q-card-section class="text-center">
          <div class="text-overline text-secondary uppercase">Neuaufnahme</div>
          <div class="text-h6 text-white">Benutzer hinzufügen</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSubmit" class="q-gutter-md">
            <q-select :options="roleOptions" label="User-Role" dark filled v-model="Role" emit-value map-options class="premium-input" />
            <q-input label="Username" dark filled v-model="Username" :rules="usernameRules" class="premium-input" />
            <q-input label="E-Mail" dark filled v-model="Email" :rules="emailRules" class="premium-input" />
            <div class="row q-col-gutter-sm">
              <q-input class="col-6 premium-input" label="Vorname" dark filled v-model="Vorname" />
              <q-input class="col-6 premium-input" label="Nachname" dark filled v-model="Nachname" />
            </div>
            <q-input label="Telefonnr." dark filled v-model="Telefon" class="premium-input" />
            <q-input label="Passwort" dark filled v-model="Password" :type="isPwd ? 'password' : 'text'" :rules="passwordRules" class="premium-input">
              <template v-slot:append><q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" /></template>
            </q-input>
            <q-input label="Passwort wiederholen" dark filled v-model="PasswordRepeat" :type="isPwd ? 'password' : 'text'" :rules="passwordRepeatRules" class="premium-input" />
            
            <q-card-actions align="center" class="q-mt-md flex column">
              
              <q-btn type="submit" label="Speichern" color="secondary" class="luxury-btn full-width q-mb-xs" :loading="isLoading" />
              <q-btn label="Abbrechen" color="white" flat @click="closeUserAdd" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditDialog" persistent backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 400px">
        <q-card-section class="text-center">
          <div class="text-overline text-secondary uppercase">Profil anpassen</div>
          <div class="text-h6 text-white">{{ editingUser?.username }} bearbeiten</div>
        </q-card-section>
        <q-card-section>
          <q-form ref="editFormRef" @submit.prevent="saveUserChanges" class="q-gutter-y-md">
            <q-input label="E-Mail" dark filled v-model="editingUser!.email" :rules="[(val) => !!val || 'E-Mail ist erforderlich']" class="premium-input" />
            <q-input label="Vorname" dark filled v-model="editingUser!.firstName" class="premium-input" />
            <q-input label="Nachname" dark filled v-model="editingUser!.lastName" class="premium-input" />
            <q-input label="Telefonnummer" dark filled v-model="editingUser!.telephone" class="premium-input" />
            <q-card-actions align="right" class="flex column">

              <q-btn type="submit" label="Änderungen speichern" color="secondary" class="luxury-btn full-width q-mb-xs" :loading="editLoading" />
                         <q-btn label="Abbrechen" flat color="white" @click="showEditDialog = false" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPasswordDialog" persistent backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 400px">
        <q-card-section class="text-center">
          <div class="text-overline text-secondary uppercase">Sicherheit</div>
          <div class="text-h6 text-white">Neues Passwort vergeben</div>
        </q-card-section>
        <q-card-section>
          <q-form ref="passwordFormRef" @submit.prevent="submitPasswordChange" class="q-gutter-y-md">
            <q-input v-model="passwordForm.newPassword" type="password" label="Neues Passwort" dark filled class="premium-input" :rules="[(val) => !!val || 'Erforderlich', (val) => val.length >= 6 || 'Mind. 6 Zeichen']" />
            <q-input v-model="passwordForm.confirmNewPassword" type="password" label="Bestätigen" dark filled class="premium-input" :rules="[(val) => val === passwordForm.newPassword || 'Stimmt nicht überein']" />
            <q-card-actions align="right" class="flex column">
              
              <q-btn type="submit" label="Passwort setzen" color="secondary" class="luxury-btn full-width q-mb-xs" :loading="passwordLoading" />
              <q-btn label="Abbrechen" flat color="white" @click="showPasswordDialog = false" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog" backdrop-filter="blur(10px)">
      <q-card class="premium-glass-card-dialog" style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <div class="text-h6 q-ml-md text-white">Löschen bestätigen</div>
        </q-card-section>
        <q-card-section class="text-grey-4">
          Möchten Sie den Benutzer <strong>{{ userToDelete?.username }}</strong> wirklich dauerhaft aus dem System entfernen?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" color="white" v-close-popup />
          <q-btn label="Unwiderruflich löschen" color="negative" @click="confirmDeleteUser" :loading="deleteLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import type { QForm } from "quasar";
import { useRegister } from "../components/register";
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

// Benutzer hinzufügen

const roleOptions = [
  { label: "User", value: 0 },
  { label: "Admin", value: 1 },
];
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
  Role,
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
  console.log("Role.value:", Role.value);
  console.log("Type of Role.value:", typeof Role.value);
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
  rowsPerPage: 10,
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

    const response = await api.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    users.value = response.data;
  } catch (err: unknown) {
    console.error("Fehler beim Laden der Benutzerdaten:", err);

    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        error.value = "Sitzung abgelaufen. Bitte melden Sie sich erneut an.";
      } else if (err.response?.status === 403) {
        error.value = "Keine Berechtigung für diese Aktion.";
      } else {
        error.value = `Fehler beim Laden der Benutzerdaten: ${err.response?.status} - ${err.response?.data || err.message}`;
      }
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Ein unbekannter Fehler ist aufgetreten";
    }

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

    await api.put(
      `/api/users/${editingUser.value.id}`,
      {
        email: editingUser.value.email,
        firstName: editingUser.value.firstName,
        lastName: editingUser.value.lastName,
        telephone: editingUser.value.telephone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    await api.post(`/api/users/${passwordUser.value.id}/change-password`, {
      newPassword: passwordForm.value.newPassword,
      confirmNewPassword: passwordForm.value.confirmNewPassword,
    });

    $q.notify({
      type: "positive",
      message: `Passwort für ${passwordUser.value.username} erfolgreich geändert`,
      position: "top",
    });

    showPasswordDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Ändern des Passworts:", err);

    let message = "Fehler beim Ändern des Passworts";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
    } else if (err instanceof Error) {
      message = err.message;
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

// Benutzer löschen
const deleteUser = (user: UserInfo) => {
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

    // Wenn dein Axios-Interceptor den Token setzt, kannst du headers weglassen
    await api.delete(`/api/users/${userToDelete.value.id}`);

    users.value = users.value.filter((u) => u.id !== userToDelete.value!.id);

    $q.notify({
      type: "positive",
      message: `Benutzer ${userToDelete.value.username} erfolgreich gelöscht`,
      position: "top",
    });

    showDeleteDialog.value = false;
  } catch (err) {
    console.error("Fehler beim Löschen des Benutzers:", err);

    let message = "Fehler beim Löschen des Benutzers";

    if (axios.isAxiosError(err)) {
      message =
        err.response?.data?.message ||
        `Fehler beim Löschen: ${err.response?.status}`;
    } else if (err instanceof Error) {
      message = err.message;
    }

    $q.notify({
      type: "negative",
      message,
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
/* CSS von CODE 2 übernommen */
.app-container {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #2d3436 0%, #000000 100%);
  padding-top: 80px;
}

.glass-header {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  top: 53px;
}

.logo-dot {
  width: 12px;
  height: 12px;
  background-color: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--q-secondary);
}

.content-wrapper {
  width: 100%;
  max-width: 1100px;
  
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.card-inner {
  padding: 40px;
}

.premium-glass-card-dialog {
  background: rgba(20, 20, 20, 0.8) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 20px !important;
}

.premium-input {
  transition: all 0.3s ease;
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.luxury-btn {
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.luxury-btn-outline {
  border-radius: 12px;
  border-width: 2px;
}

/* Tabellen-Anpassungen für Dark-Glass */
.users-table-glass {
  background: transparent !important;
}

:deep(.q-table__card) {
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.q-table thead tr th) {
  font-weight: bold;
  color: #9e9e9e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.q-table tbody tr:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

@media (max-width: 600px) {
  .card-inner {
    padding: 20px;
  }
}
</style>
