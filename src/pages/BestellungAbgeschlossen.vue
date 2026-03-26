<template>
  <q-layout view="lHh Lpr lFf" class="glass-layout">
    <q-page-container>


      <div class="row justify-center q-pa-md items-center" style="min-height: 70vh;">
        <q-card class="success-glass-card q-pa-xl shadow-24 text-center">
          <q-card-section>
            <div class="icon-circle q-mx-auto q-mb-lg flex flex-center">
              <q-icon name="task_alt" color="secondary" size="80px" />
            </div>

            <h2 class="text-h4 text-weight-bolder text-white q-mb-md">
              Vielen Dank!
            </h2>
            
            <p class="text-subtitle1 text-grey-4">
              Deine Bestellung wurde erfolgreich abgeschlossen <br> 
              und wird nun bearbeitet.
            </p>
          </q-card-section>

          <q-card-section class="q-pt-xl">
            <q-btn
              to="/speisekarte"
              color="secondary"
              text-color="dark"
              class="premium-nav-btn full-width"
              label="Zurück zur Speisekarte"
              icon="restaurant_menu"
              push
            />
            <p class="text-caption text-grey-6 q-mt-md tracking-widest uppercase">
              Lust auf mehr?
            </p>
          </q-card-section>
        </q-card>
      </div>

      <div class="background-overlay"></div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.glass-layout {
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/kontakt.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(15px) brightness(0.3);
  z-index: 0;
}

.header-glass {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
}

.success-glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
  padding-top: 100px;
}

.icon-circle {
  width: 140px;
  height: 140px;
  background: rgba(var(--q-secondary-rgb), 0.1);
  border-radius: 50%;
  border: 2px solid rgba(var(--q-secondary-rgb), 0.2);
  box-shadow: 0 0 30px rgba(var(--q-secondary-rgb), 0.15);
}

.premium-nav-btn {
  border-radius: 16px;
  height: 56px;
  font-weight: 900;
  letter-spacing: 1px;
}

.tracking-widest {
  letter-spacing: 0.2em;
}

/* Mobile Adjustments */
@media (max-width: 600px) {
  .success-glass-card {
    padding: 20px;
    margin: 10px;
  }
  
  .text-h4 {
    font-size: 1.8rem;
  }
  
  .icon-circle {
    width: 100px;
    height: 100px;
  }
  
  .icon-circle .q-icon {
    font-size: 60px !important;
  }
}
</style>