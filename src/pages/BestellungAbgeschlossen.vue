<template>
  <q-layout>
    <q-page-container>
      <q-banner class="banner full-width text-accent">
        <h6 class="bannerText">
          <q-icon class="bannerIcon" name="credit_score" />
          Bestellung abgeschlossen
        </h6>
      </q-banner>

      <div class="above bg-white">
        <q-separator color="accent" />
        <h2 class="textOben text-h5 text-weight-thin text-center">
          deine Bestellung...
        </h2>
        <q-separator class="separatorOben" size="15px" color="grey-6" />
      </div>
      <q-img class="background-img" />
      <q-card>
        <q-card-section class="section">
          <q-item-label class="text-caption text">
            <q-icon class="icon" color="accent" name="task_alt" />
            <q-item-label class="text-h6">Vielen Dank!</q-item-label>
            deine Bestellung wurde erfolgreich abgeschlossen.
          </q-item-label>
        </q-card-section>
      </q-card>
      <h5 class="text-caption text-center color-secondary">
        weitere Bestellung machen? zur
        <RouterLink class="text-secondary" to="/speisekarte"
          >Speisekarte</RouterLink
        >
      </h5>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
  display: flex;
  justify-content: center;
  box-shadow: 2px 2px 0.4rem rgb(0, 0, 0);
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/kontakt.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.icon {
  font-size: 50px;
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
}
</style>
