<template>
  <div class="sticky-tabs">
    <q-banner class="banner full-width text-accent">
      <h6 class="bannerText">
        <q-icon class="bannerIcon" name="login" />
        Login
      </h6>
    </q-banner>

    <div class="bg-white">
      <q-separator color="accent" />
      <h2 class="textOben text-h5 text-weight-thin text-center">
        Login Daten...
      </h2>
      <q-separator size="15px" color="grey-6" class="separatorOben" />
    </div>
  </div>

  <q-card class="background-img"></q-card>
  <q-card class="my-card2">
    <q-card-section>
      <div class="text-subtitle text-center">Login</div>

      <q-form @submit="login" @reset="resetForm" class="q-gutter-md">
        <q-input
          class="q-mt-md"
          label="Username"
          filled
          v-model="Username"
          hint="Bitte geben Sie Ihren Nutzernamen an."
          :rules="usernameRules"
          lazy-rules
          :disable="isLoading"
          autocomplete="username"
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
          autocomplete="current-password"
          @keyup.enter="login"
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
          class="column"
          style="display: flex; justify-content: center; align-items: center"
        >
          <q-btn
            type="submit"
            label="Login"
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
      </q-form>

      <div class="text-caption text-center q-mt-sm text-grey-6">
        Login nur für den Admin
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
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
