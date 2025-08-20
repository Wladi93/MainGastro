<template>
  <q-page>
    <div class="sticky-tabs">
      <q-banner class="banner full-width text-accent">
        <h6 class="bannerText">
          <q-icon class="bannerIcon" name="account_box" />
          Registrieren
        </h6>
      </q-banner>

      <div class="above bg-white">
        <q-separator color="accent" />
        <h2 class="textOben text-h5 text-weight-thin text-center">
          Ihre Daten...
        </h2>
        <q-separator size="15px" color="grey-6" class="separatorOben" />
      </div>
    </div>

    <q-card class="background-img"></q-card>
    <q-card class="my-card2">
      <q-card-section>
        <div class="text-subtitle text-center">Registrieren</div>

        <q-form @submit="register" @reset="resetForm" class="q-gutter-md">
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
            :rules="usernameRules"
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
            :rules="usernameRules"
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
        </q-form>
        <div class="full-width">
          <q-btn
            type="submit"
            label="Registrieren"
            icon="login"
            color="secondary"
            class="q-mt-md full-width"
            :loading="isLoading"
            :disable="isLoading"
          />

          <q-btn
            type="reset"
            label="Zurücksetzen"
            color="primary"
            flat
            class="full-width"
            :disable="isLoading"
          />
        </div>

        <div class="text-caption text-center q-mt-sm text-grey-6">
          Du hast schon einen Account? Hier geht es zum
          <RouterLink class="text-secondary" to="/login"
            ><q-icon name="login" size="xs" />Login</RouterLink
          >
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRegister } from "../components/register";

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
} = useRegister();
</script>

<style>
.background-img {
  position: absolute;
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
  margin-top: 1.7%;
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
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
