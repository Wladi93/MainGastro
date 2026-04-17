<template>
  <div class="app-container flex flex-center">
    <div class="glass-header full-width fixed-top" style="z-index: 1;">
      <div class="row items-center q-px-md q-py-md">
        <div class="logo-dot q-mr-sm"></div>
        <span class="text-h6 text-white text-weight-bolder uppercase">Zugriff verweigert</span>
      </div>
    </div>

    <div class="content-wrapper q-px-md flex flex-center">
      <div class="premium-glass-card shadow-24 text-center">
        <div class="card-inner q-pa-xl">
          
          <div class="icon-container q-mb-lg">
            <q-icon name="lock" size="100px" color="negative" class="error-glow" />
          </div>

          <div class="text-h3 text-white text-weight-bolder q-mb-sm">401</div>
          <div class="text-h6 text-secondary q-mb-md uppercase tracking-widest">Unauthorized</div>
          
          <q-separator dark class="q-my-lg opacity-2" />

          <p class="text-grey-4 text-body1 q-mb-xl">
            Du hast keine Berechtigung, diesen Bereich zu betreten. Bitte melde dich mit einem Administrator-Konto an.
          </p>

          <q-btn
            to="/login"
            color="secondary"
            class="full-width login-button"
            label="Zum Admin-Login"
            icon="login"
            size="lg"
            no-caps
          />

          <div class="q-mt-lg">
            <q-btn flat to="/" label="Zurück zur Startseite" color="grey-5" no-caps />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  width: 100%;
}

.glass-header {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  top: 0;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.content-wrapper {
  width: 100%;
  max-width: 500px;
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 32px;
  width: 100%;
}

.error-glow {
  filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.3));
}

.tracking-widest {
  letter-spacing: 0.2em;
}

.login-button {
  border-radius: 16px;
  font-weight: bold;
  box-shadow: 0 8px 20px rgba(var(--q-secondary), 0.15);
}

.opacity-2 {
  opacity: 0.1;
}

.uppercase {
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 3rem;
  }
}
</style>