<template>
  <q-dialog v-model="showDialog" persistent position="bottom">
    <div class="cookie-glass-card q-ma-md shadow-24">
      <div class="q-pa-lg">
        <div class="row items-center q-mb-md">
          <div class="cookie-icon-bg q-mr-sm">
            <q-icon name="cookie" color="secondary" size="24px" />
          </div>
          <div class="text-h6 text-white text-weight-bolder">Cookie-Einstellungen</div>
        </div>

        <p class="text-grey-4 text-body2 line-height-relaxed">
          Wir verwenden 
          <RouterLink class="text-secondary text-weight-bold no-decoration" to="/cookies">Cookies</RouterLink>, 
          um Ihr Erlebnis zu verbessern. Durch die Nutzung der Website stimmen Sie der 
          <RouterLink class="text-secondary text-weight-bold no-decoration" to="/datenschutzerklaerung">Datenschutzerklärung</RouterLink> 
          zu.
        </p>

        <div class="row q-gutter-sm q-mt-md">
          <q-btn 
            label="Akzeptieren" 
            color="secondary" 
            class="col-grow btn-rounded text-weight-bold" 
            no-caps 
            @click="acceptCookies" 
          />
          <q-btn 
            label="Ablehnen" 
            outline
            color="white" 
            class="col-grow btn-rounded text-weight-medium opacity-7" 
            no-caps 
            :class="{ 'shake-animation': isShaking }"
            @click="declineCookies" 
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const showDialog = ref<boolean>(false)
const isShaking = ref<boolean>(false)
const cookiesAccepted = ref<boolean>(localStorage.getItem('cookiesAccepted') === 'true')

const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', 'true')
  showDialog.value = false
}

const declineCookies = () => {
  // Kleiner visueller Effekt beim Ablehnen
  isShaking.value = true
  setTimeout(() => (isShaking.value = false), 500)

  $q.notify({
    message: 'Bitte akzeptieren, um alle Funktionen zu nutzen.',
    icon: 'info',
    color: 'secondary',
    textColor: 'white',
    position: 'top',
    timeout: 2000,
  })
}

onMounted(() => {
  if (!cookiesAccepted.value) {
    // Kurze Verzögerung für einen sanften Auftritt
    setTimeout(() => {
      showDialog.value = true
    }, 1000)
  }
})
</script>

<style scoped>
.cookie-glass-card {
  background: rgba(25, 25, 25, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  max-width: 450px;
  width: 100%;
}

.cookie-icon-bg {
  background: rgba(var(--q-secondary), 0.1);
  padding: 8px;
  border-radius: 12px;
}

.btn-rounded {
  border-radius: 12px;
  padding: 8px 16px;
}

.no-decoration {
  text-decoration: none;
}

.line-height-relaxed {
  line-height: 1.5;
}

.opacity-7 {
  opacity: 0.7;
}

/* Schüttel-Animation wenn man auf "Ablehnen" klickt */
.shake-animation {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Damit das Dialog-Hintergrund-Overlay nicht alles komplett schwarz macht */
:deep(.q-dialog__backdrop) {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.4);
}
</style>