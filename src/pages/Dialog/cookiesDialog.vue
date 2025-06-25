<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Cookies verwenden</div>
        <p>
          Wir verwenden <RouterLink class="text-secondary" to="/cookies">Cookies</RouterLink>, um
          Ihnen eine bessere Benutzererfahrung zu bieten. Indem Sie unsere Website weiterhin nutzen,
          stimmen Sie der Verwendung von
          <RouterLink class="text-secondary" to="/cookies">Cookies</RouterLink> und der
          <RouterLink class="text-secondary" to="/datenschutzerklaerung"
            >Datenschutzerklärung</RouterLink
          >
          zu.
        </p>
      </q-card-section>
      <q-card-actions>
        <q-btn label="Akzeptieren" color="primary" @click="acceptCookies" />
        <q-btn class="btnAnimation" label="Ablehnen" color="secondary" @click="declineCookies" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const showDialog = ref<boolean>(true)
const cookiesAccepted = ref<boolean>(localStorage.getItem('cookiesAccepted') === 'true')

watch(cookiesAccepted, (newValue) => {
  if (newValue === false) {
    showDialog.value = true
  } else {
    showDialog.value = false
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', 'true')
  showDialog.value = false
}
const declineCookies = () => {
  localStorage.setItem('cookiesAccepted', 'false')
  showDialog.value = true
  $q.notify({
    message: 'Bitte Cookies akzeptieren um die Webseite nutzen zu können',
    icon: 'cancel',
    color: 'red',
    position: 'top',
    timeout: 400,
  })
}

if (cookiesAccepted.value) {
  showDialog.value = false
}
onMounted(() => {
  if (!cookiesAccepted.value) {
    showDialog.value = true
  }
})
</script>

<style scoped></style>
