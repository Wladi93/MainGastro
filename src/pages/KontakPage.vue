<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="contacts" class="bannerIcon" />
      Kontakt
    </h6>
  </q-banner>
  <div class="above bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">
      Ihr Anliegen...
    </h2>
    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>
  <q-img class="background-img" />
  <div class="row items-start">
    <q-card bordered aquare class="my-card align-center q-mt-md">
      <div class="q-gutter-y-md">
        <q-card-section>
          <h2 class="text-overline">Bitte füllen Sie das Formular aus</h2>
          <q-separator class="q-mb-md" />
          <q-input
            class="q-mb-sm"
            filled
            v-model="vorname"
            label="Vorname *"
            stack-label
            label-color="secondary"
            placeholder="bitte den Namen eingeben..."
            :dense="dense"
            :rules="[(val) => !!val || 'Bitte Ausfüllen']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>
          <q-input
            class="q-mb-sm"
            filled
            v-model="nachname"
            label="Nachname *"
            stack-label
            label-color="secondary"
            placeholder="bitte den Namen eingeben..."
            :dense="dense"
            :rules="[(val) => !!val || 'Bitte Ausfüllen']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>
          <q-input
            label-slot
            class="q-mb-sm"
            filled
            v-model="email"
            label="E-Mail *"
            stack-label
            label-color="secondary"
            placeholder="bitte die E-Mail-Adresse eingeben..."
            :dense="dense"
            :rules="[
              (val) =>
                (val && val.includes('@')) ||
                'bitte eine gültige E-Mail-Adresse angeben.',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            class="q-mb-sm"
            filled
            v-model="telefon"
            label="Telefon/Handynr."
            label-color="secondary"
            stack-label
            placeholder="bitte die Nummer eingeben..."
            :dense="dense"
            :rules="[
              (val) =>
                /^(\+?\d+)*$/.test(val) || 'Bitte eine gültige Nummer angeben',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
          <q-input
            class="q-mb-sm"
            filled
            v-model="anliegen"
            label="Anliegen"
            label-color="secondary"
            stack-label
            placeholder="bitte schreiben Sie ihr Anliegen rein..."
            :dense="dense"
            type="textarea"
            :rules="[(val) => !!val || 'Bitte Ausfüllen']"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <q-btn
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            class="full-width"
            ripple
            square
            color="secondary"
            label="Absenden"
            @click="sendKontaktToApi"
          >
            <q-icon name="email" class="icn" />
          </q-btn>
        </q-card-section>
      </div>
    </q-card>
  </div>
  <h5 class="text-caption text-center color-secondary">
    Bestellen? zur
    <RouterLink class="text-secondary" to="/speisekarte"
      >Speisekarte</RouterLink
    >
  </h5>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();
const vorname = ref("");
const nachname = ref("");
const email = ref("");
const telefon = ref("");
const anliegen = ref("");
const dense = ref(false);

const sendKontaktToApi = async () => {
  try {
    const kontaktData = {
      vorname: vorname.value,
      nachname: nachname.value,
      email: email.value,
      telefon: telefon?.value,
      anliegen: anliegen.value,
    };
    const response = await fetch("http://localhost:5008/api/kontaktmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kontaktData),
    });

    if (response.ok) {
      const result = await response.json();
      $q.notify({
        message: "Nachricht erfolgreich gesendet!",
        icon: "check",
        color: "green",
        position: "top",
        timeout: 400,
      });
      console.log(result);
    } else {
      const errorText = await response.text();
      console.error(
        `Fehler beim Senden der Nachricht: ${response.status} - ${errorText}`
      );
      throw new Error("Fehler beim Senden der Bestellung");
    }
  } catch (error) {
    console.error("Fehler:", error);
    $q.notify({
      message: "Fehler beim Senden der Nachricht.",
      icon: "cancel",
      color: "red",
      position: "top",
      timeout: 400,
    });
  } finally {
    await router.push("/");
    $q.loading.hide();
  }
};
</script>

<style scoped>
.my-card {
  min-width: 1200px;
  max-width: 1200px;
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  padding: 0.5%;
  text-align: center;
}
.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/kontakt.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(6px);
  opacity: 0.5;
  z-index: -1;
}
.icn {
  font-size: 30px;
  margin-left: 1%;
}
.bannerIcon {
  size: 30px;
}
@media (max-width: 600px) {
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
  .banner {
    max-height: 10px;
  }
  .bannerText {
    font-size: 12px;
  }
  .bannerIcon {
    font-size: 20px;
  }
  .my-card {
    min-width: 95%;
  }
}
</style>
