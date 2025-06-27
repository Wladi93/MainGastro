import { ref } from "vue";
import { useQuasar } from "quasar";
import api from "src/boot/axios";

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  telephone?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  telephone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserInfo;
}

export const useRegister = (onSuccess?: () => void) => {
  const $q = useQuasar();

  const Username = ref("");
  const Email = ref("");
  const Vorname = ref("");
  const Nachname = ref("");
  const Telefon = ref("");
  const Password = ref("");
  const PasswordRepeat = ref("");
  const isPwd = ref(true);
  const isLoading = ref(false);

  const usernameRules = [
    (val: string) => !!val || "Dieses Feld ist erforderlich",
  ];
  const emailRules = [(val: string) => !!val || "Dieses Feld ist erforderlich"];
  const vornamenameRules = [
    (val: string) => !!val || "Dieses Feld ist erforderlich",
  ];
  const nachnamenameRules = [
    (val: string) => !!val || "Dieses Feld ist erforderlich",
  ];

  const passwordRules = [
    (val: string) => !!val || "Dieses Feld ist erforderlich",
    (val: string) =>
      val.length >= 6 || "Passwort muss mindestens 6 Zeichen lang sein",
  ];
  const passwordRepeatRules = [
    (val: string) => !!val || "Bitte wiederholen Sie das Passwort.",
    (val: string) =>
      val === Password.value || "Passwörter stimmen nicht überein.",
  ];

  const register = async (): Promise<void> => {
    if (
      !Username.value ||
      !Password.value ||
      !PasswordRepeat.value ||
      !Email.value ||
      !Vorname.value ||
      !Nachname.value ||
      !Telefon.value // Korrigiert: fehlendes ! hinzugefügt
    ) {
      $q.notify({
        type: "negative",
        message: "Bitte füllen Sie alle Felder aus",
      });
      return;
    }

    if (Password.value !== PasswordRepeat.value) {
      $q.notify({
        type: "negative",
        message: "Passwörter stimmen nicht überein",
      });
      return;
    }

    isLoading.value = true;

    try {
      const registerData: RegisterData = {
        username: Username.value,
        password: Password.value,
        email: Email.value,
        firstname: Vorname.value,
        lastname: Nachname.value,
        telephone: Telefon.value,
      };

      const { data } = await api.post<RegisterResponse>(
        "/api/auth/register",
        registerData
      );

      if (!data.success) {
        $q.notify({
          type: "negative",
          message: data.message || "Benutzer hinzufügen fehlgeschlagen",
        });
        return;
      }

      $q.notify({
        type: "positive",
        message: "Benutzer wurde erfolgreich hinzugefügt!",
      });
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Benutzers:", error);
      $q.notify({
        type: "negative",
        message: "Fehler beim Registrieren des Benutzers",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const resetForm = (): void => {
    Username.value = "";
    Email.value = "";
    Vorname.value = "";
    Nachname.value = "";
    Telefon.value = "";
    Password.value = "";
    PasswordRepeat.value = "";
    isPwd.value = true;
  };

  return {
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
    emailRules,
    vornamenameRules,
    nachnamenameRules,
    passwordRules,
    passwordRepeatRules,
    register,
    resetForm,
  };
};
