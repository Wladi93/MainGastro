<template>
  <q-page>

    <div class="sticky-tabs">
      <q-banner class="banner full-width text-accent">
        <h6 class="bannerText">
          <q-icon class="bannerIcon" name="directions_car" />
          Anfahrt
        </h6>
      </q-banner>

      <div class=" bg-white">
        <q-separator color="accent" />
        <h2 class="textOben text-h5 text-weight-thin text-center">Unsere Daten...</h2>
<q-separator size="1px" color="grey-6"  />
      </div>
    </div>

      <q-img class="background-img" />
      <div class="content-wrapper">
      
      
        <q-card class="location-card">
<div class="card-header" style="position: relative; text-align: center;">
  <q-icon 
    name="place" 
    color="accent" 
    size="2rem" 
    class="q-ml-md" 
    style="position: absolute; left: 0; top: 50%; transform: translateY(-50%);" 
  />
  <h5 class="card-title text-accent" style="margin: 0;">Unser Standort</h5>
</div>

          
          <div class="map-container">
            <iframe
              v-if="cookiesAccepted"
              class="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2431.1844580471966!2d7.173619478162399!3d52.45768674083941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8274dfe6d92df%3A0xd9cca197bf1dd9c9!2sImbiss%20am%20Tower!5e0!3m2!1sde!2sde!4v1750671784939!5m2!1sde!2sde"
              width="100%"
              height="350"
              allowfullscreen="true"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <div v-else class="cookie-placeholder">
              <q-icon name="cookie" size="3rem" color="grey-5" />
              <p class="text-grey-6">Karte wird nach Cookie-Zustimmung angezeigt</p>
            </div>
          </div>
          
          
          
          <div class="address-section column" style="display: flex; justify-content: center; align-items: center;">
            <div class="address-header">
              <q-icon  name="business" color="accent" size="1.5rem" />

            </div>
            <div class="address-info full-width column" style=" display: flex; justify-content: center; align-items: center;">
              <div class="address-line business-name">Imbiss am Tower GmbH</div>
              <div class="address-line text-grey-6">Flugplatzstraße 56</div>
              <div class="address-line text-grey-6">48531 Nordhorn</div>
            </div>
          </div>
        </q-card>
      </div>
      
      <div class="bottom-link">
        <q-chip 
          
          color="primary" 
          text-color="white"
          icon="restaurant_menu"
          clickable
          @click="$router.push('/speisekarte')"
          class="menu-chip"
        >
          Zur Speisekarte
        </q-chip>
      </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const cookiesAccepted = ref(false)
onMounted(() => {
  if (localStorage.getItem('cookiesAccepted') === 'true') {
    cookiesAccepted.value = true
  }
})
</script>

<style scoped>
.banner {
  background-color: rgba(230, 230, 230);
  text-align: center;
  font-family: sans-serif;
}

.bannerText {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-weight: 500;
}

.bannerIcon {
  font-size: 1.5rem;
}

.above {
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.textOben {
  margin: 0.5rem 0;
  color: var(--q-dark);
  font-weight: 300;
  letter-spacing: 0.5px;
}

.separatorOben {
  width: 60px;
  margin: 0 auto;
  border-radius: 2px;
}

.background-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('./images/anfahrt2.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: blur(3px) brightness(1.0);
  z-index: -1;
}

.content-wrapper {
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  min-height: 60vh;
}

.location-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.location-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}


.card-title {
  margin: 0;
  font-weight: 500;
  font-size: 1.25rem;
}

.map-container {
  position: relative;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
}

.map-iframe {
  border-radius: 2px;
  border: 2px solid rgba(var(--q-primary-rgb), 0.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.map-iframe:hover {
  border-color: rgba(var(--q-primary-rgb), 0.3);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.cookie-placeholder {
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--q-grey-2-rgb), 0.5);
  border-radius: 12px;
  border: 2px dashed var(--q-grey-4);
}

.map-attribution {
  text-align: center;
  padding: 0.5rem 1.5rem 1rem;
}

.content-separator {
  margin: 0 1.5rem;
  background: linear-gradient(90deg, transparent 0%, var(--q-primary) 50%, transparent 100%);
  height: 1px;
}

.address-section {
  padding: 1.5rem 2rem 2rem;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-title {
  margin: 0;
  font-weight: 500;
  font-size: 1.1rem;
}



.address-line {
  margin: 0.25rem 0;
  color: var(--q-dark);
  font-size: 0.95rem;
  line-height: 1.4;
}

.business-name {
  font-weight: 600;
  color: var(--q-accent);
  font-size: 1rem;
}

.bottom-link {
  text-align: center;
  padding: 1rem;
  margin-bottom: 2rem;
}

.menu-chip {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  border-width: 2px;
  transition: all 0.3s ease;
}

.menu-chip:hover {
  background: var(--q-primary);
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--q-primary-rgb), 0.3);
}


@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem 0.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem 0.75rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .map-container {
    padding: 0 1rem;
  }
  
  .map-iframe {
    height: 280px;
  }
  
  .address-section {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .bannerText {
    font-size: 0.9rem;
  }
  
  .bannerIcon {
    font-size: 1.2rem;
  }
  
  .textOben {
    font-size: 1rem;
  }
}
.sticky-tabs {
  position: sticky;
  top: 52px;
  z-index: 1;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
@media (max-width: 480px) {
  .above {
    padding: 0.75rem 0;
  }
  
  .textOben {
    font-size: 0.9rem;
  }
  
  .card-header {
    padding: 0.75rem 1rem 0.5rem;
  }
  
  .address-section {
    padding: 0.75rem 1rem 1rem;
  }
  
  .map-iframe {
    height: 250px;
  }
  
  .menu-chip {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>