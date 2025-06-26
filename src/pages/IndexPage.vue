<template>
  <q-banner class="banner full-width text-accent">
    <h6 class="bannerText">
      <q-icon name="home" class="bannerIcon" />
      Startseite
    </h6>
  </q-banner>
  <div class="oben bg-white">
    <q-separator color="accent" />
    <h2 class="textOben text-h5 text-weight-thin text-center">Willkommen...</h2>

    <q-separator class="separatorOben" size="15px" color="grey-6" />
  </div>

  <div class="animated-background">
    <div class="sky-gradient"></div>
    <div class="clouds-container">
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
      <div class="cloud cloud4"></div>
      <div class="cloud cloud5"></div>
      <div class="cloud cloud6"></div>
      <div class="cloud cloud7"></div>
      <div class="cloud cloud8"></div>
    </div>
    <div class="horizon-clouds">
      <div class="horizon-cloud hcloud1"></div>
      <div class="horizon-cloud hcloud2"></div>
      <div class="horizon-cloud hcloud3"></div>
      <div class="horizon-cloud hcloud4"></div>
    </div>
    <div class="planes-container">
      <div class="plane plane1">✈️</div>
      <div class="plane plane2">🛩️</div>
    </div>
    <div class="sunset-planes">
      <div class="sunset-plane splane1">🛩️</div>
      <div class="sunset-plane splane2">✈️</div>
      <div class="sunset-plane splane3">🚁</div>
    </div>

    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
  </div>

  <div class="q-mt-md" style="display: flex; justify-content: center">
    <q-card class="column my-card" style="max-width: 900px">
      <div class="img-container">
        <q-img class="img" src="./images/imbisstower2.jpeg">
          <div class="text text-subtitle2 text-center">
            <h6 class="q-mt-md">Herzlich Willkommen</h6>
            <q-separator inset class="q-mb-lg bg-white" size="2px" />

            <div
              class="q-mt-sm"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            ></div>
            <h6 class="text-caption text-weight-medium">
              Inmitten von Nordhorn-Klausheide bieten wir Ihnen nicht nur eine
              Auswahl an köstlichen Gerichten, sondern auch ein einzigartiges
              Ambiente, das zum Genießen einlädt.
            </h6>

            <div
              class="q-mb-md q-mt-md"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-img
                style="
                  height: 150px;
                  width: 150px;
                  border-radius: 50%;
                  border: 2px solid #165cb1;
                "
                src="/public/icons/Logo Imbiss am Tower 2.jpg"
              />
            </div>
            <h6 class="text-caption">
              Unsere Speisen können Sie vor Ort, als auch zum Abholen bestellen.
            </h6>

            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
              class="full-width"
            >
              <q-card-section class="full-width">
                <q-btn
                  dense
                  label="Zur Speisekarte"
                  class="gradient-btn full-width"
                  text-color="white"
                  icon="restaurant_menu"
                  clickable
                  @click="onSubmit"
                >
                </q-btn>
              </q-card-section>
            </div>

            <q-separator inset class="q-mt-lg q-mb-sm bg-white" size="2px" />
            <h6 class="text-overline">
              Sie wollen feiern? Wir Vermieten Ihnen unsere Location. Fragen Sie
              uns gerne an!
            </h6>
          </div>
        </q-img>

        <div class="img-particles">
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
          <div class="img-particle"></div>
        </div>

        <div class="glow-effect"></div>
      </div>
    </q-card>
  </div>
  <h5 class="text-caption text-center color-secondary">
    Sie haben Fragen? zum
    <RouterLink class="text-secondary" to="/kontakt"
      >Kontaktformular</RouterLink
    >
  </h5>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const onSubmit = () => {
  void router.push("/speisekarte");
};
</script>

<style scoped>
.my-card {
  box-shadow: 1px 1px 0.8rem rgb(53, 53, 53);
  text-align: center;
  width: 94%;
  position: relative;
  z-index: 10;
}

.img-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

/* Gradient Button Styling */
.gradient-btn {
  z-index: 100;
  background: linear-gradient(
    135deg,
    #165cb1 0%,
    #165cb1 25%,
    #165cb1 45%,
    #165cb1 55%,
    #165cb1 75%,
    #165cb1 100%
  );
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.gradient-btn:hover {
  background: linear-gradient(
    135deg,
    #165cb1 0%,
    #165cb1 25%,
    #165cb1 45%,
    #165cb1 55%,
    #165cb1 75%,
    #165cb1 100%
  );
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.gradient-btn:before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  transition: left 0.5s;
}

.gradient-btn:hover:before {
  left: 100%;
}

/* Partikeleffekte für das Bild */
.img-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.img-particle {
  position: absolute;
  opacity: 0;
  width: 4px;
  height: 4px;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.8) 0%,
    rgba(255, 165, 0, 0.6) 50%,
    rgba(255, 69, 0, 0.4) 100%
  );
  border-radius: 50%;
  animation: imgParticleFloat 8s linear infinite;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
}

/* Individuelle Partikel-Animationen */
.img-particle:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
  animation-duration: 10s;
}

.img-particle:nth-child(2) {
  left: 25%;
  animation-delay: 1.5s;
  animation-duration: 12s;
}

.img-particle:nth-child(3) {
  left: 35%;
  animation-delay: 3s;
  animation-duration: 9s;
}

.img-particle:nth-child(4) {
  left: 45%;
  animation-delay: 4.5s;
  animation-duration: 11s;
}

.img-particle:nth-child(5) {
  left: 55%;
  animation-delay: 6s;
  animation-duration: 13s;
}

.img-particle:nth-child(6) {
  left: 65%;
  animation-delay: 1s;
  animation-duration: 8s;
}

.img-particle:nth-child(7) {
  left: 75%;
  animation-delay: 2.5s;
  animation-duration: 14s;
}

.img-particle:nth-child(8) {
  left: 85%;
  animation-delay: 4s;
  animation-duration: 10s;
}

.img-particle:nth-child(9) {
  left: 5%;
  animation-delay: 5.5s;
  animation-duration: 12s;
}

.img-particle:nth-child(10) {
  left: 95%;
  animation-delay: 7s;
  animation-duration: 9s;
}

.img-particle:nth-child(11) {
  left: 20%;
  animation-delay: 8.5s;
  animation-duration: 11s;
}

.img-particle:nth-child(12) {
  left: 80%;
  animation-delay: 10s;
  animation-duration: 13s;
}

@keyframes imgParticleFloat {
  0% {
    bottom: -10px;
    opacity: 0;
    transform: translateX(0px) scale(0.5);
  }
  10% {
    opacity: 1;
    transform: translateX(5px) scale(1);
  }
  50% {
    transform: translateX(-10px) scale(1.2);
  }
  90% {
    opacity: 1;
    transform: translateX(15px) scale(0.8);
  }
  100% {
    bottom: 100%;
    opacity: 0;
    transform: translateX(20px) scale(0.3);
  }
}

/* Sanfter Glüh-Effekt */
.glow-effect {
  opacity: 0;
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    rgba(255, 215, 0, 0.3),
    rgba(255, 165, 0, 0.2),
    rgba(255, 69, 0, 0.1),
    rgba(255, 215, 0, 0.3)
  );
  border-radius: 6px;
  opacity: 0;
  animation: glowPulse 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
}

.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    #4a90e2 0%,
    #87ceeb 20%,
    #fff8e6 70%,
    #ffe4cc 85%,
    #ffb366 100%
  );
  animation: skyShift 25s ease-in-out infinite;
}

@keyframes skyShift {
  0%,
  100% {
    background: linear-gradient(
      180deg,
      #4a90e2 0%,
      #87ceeb 20%,
      #fff8e6 70%,
      #ffe4cc 85%,
      #ffb366 100%
    );
  }
  50% {
    background: linear-gradient(
      180deg,
      #5ba3f5 0%,
      #a8d8ea 20%,
      #fff5e6 70%,
      #ffd9b3 85%,
      #ff9933 100%
    );
  }
}

.clouds-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  opacity: 0.85;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.cloud:before {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
}

.cloud:after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
}

.cloud1 {
  width: 100px;
  height: 40px;
  top: 20%;
  left: -100px;
  animation: floatRight 25s linear infinite;
}

.cloud1:before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud1:after {
  width: 60px;
  height: 40px;
  top: -15px;
  right: 10px;
}

.cloud2 {
  width: 80px;
  height: 35px;
  top: 15%;
  left: -80px;
  animation: floatRight 30s linear infinite 5s;
}

.cloud2:before {
  width: 45px;
  height: 45px;
  top: -20px;
  left: 15px;
}

.cloud2:after {
  width: 55px;
  height: 35px;
  top: -10px;
  right: 15px;
}

.cloud3 {
  width: 120px;
  height: 45px;
  top: 25%;
  left: -120px;
  animation: floatRight 35s linear infinite 10s;
}

.cloud3:before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 20px;
}

.cloud3:after {
  width: 70px;
  height: 45px;
  top: -20px;
  right: 20px;
}

.cloud4 {
  width: 90px;
  height: 38px;
  top: 12%;
  left: -90px;
  animation: floatRight 28s linear infinite 15s;
}

.cloud4:before {
  width: 48px;
  height: 48px;
  top: -22px;
  left: 12px;
}

.cloud4:after {
  width: 58px;
  height: 38px;
  top: -12px;
  right: 12px;
}

/* Sonnenuntergang-Flugzeuge */
.sunset-planes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.sunset-plane {
  position: absolute;
  font-size: 1.8rem;
  z-index: 2;
  filter: drop-shadow(2px 2px 4px rgba(255, 180, 102, 0.6));
}

.splane1 {
  bottom: 25%;
  left: -60px;
  animation: sunsetFly 18s linear infinite;
  transform: scaleX(-1);
}

.splane2 {
  bottom: 20%;
  left: -50px;
  animation: sunsetFly 22s linear infinite 8s;
}

.splane3 {
  bottom: 30%;
  left: -55px;
  animation: sunsetFly 20s linear infinite 15s;
  transform: scaleX(-1);
}

@keyframes sunsetFly {
  0% {
    left: -60px;
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  20% {
    opacity: 1;
    transform: translateY(-8px) rotate(1deg);
  }
  50% {
    transform: translateY(5px) rotate(-0.5deg);
  }
  80% {
    transform: translateY(-3px) rotate(0.5deg);
    opacity: 1;
  }
  100% {
    left: 100vw;
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
}

/* Horizont-Wolken */
.horizon-clouds {
  position: absolute;
  bottom: 8%;
  width: 100%;
  height: 15%;
}

.horizon-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 60px;
  opacity: 0.8;
  filter: drop-shadow(1px 1px 3px rgba(255, 180, 102, 0.3));
}

.horizon-cloud:before {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50px;
}

.horizon-cloud:after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50px;
}

.hcloud1 {
  width: 140px;
  height: 35px;
  bottom: 20px;
  left: -140px;
  animation: driftRight 30s linear infinite;
}

.hcloud1:before {
  width: 60px;
  height: 45px;
  top: -20px;
  left: 25px;
}

.hcloud1:after {
  width: 70px;
  height: 35px;
  top: -12px;
  right: 25px;
}

.hcloud2 {
  width: 180px;
  height: 40px;
  bottom: 15px;
  left: -180px;
  animation: driftRight 35s linear infinite 10s;
}

.hcloud2:before {
  width: 75px;
  height: 55px;
  top: -25px;
  left: 35px;
}

.hcloud2:after {
  width: 85px;
  height: 40px;
  top: -15px;
  right: 35px;
}

.hcloud3 {
  width: 120px;
  height: 32px;
  bottom: 25px;
  left: -120px;
  animation: driftRight 28s linear infinite 20s;
}

.hcloud3:before {
  width: 55px;
  height: 40px;
  top: -18px;
  left: 20px;
}

.hcloud3:after {
  width: 65px;
  height: 32px;
  top: -10px;
  right: 20px;
}

.hcloud4 {
  width: 160px;
  height: 38px;
  bottom: 18px;
  left: -160px;
  animation: driftRight 32s linear infinite 15s;
}

.hcloud4:before {
  width: 70px;
  height: 50px;
  top: -22px;
  left: 30px;
}

.hcloud4:after {
  width: 80px;
  height: 38px;
  top: -12px;
  right: 30px;
}

@keyframes driftRight {
  0% {
    left: -200px;
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    left: 100vw;
    transform: translateY(0px);
  }
}

.cloud5 {
  width: 110px;
  height: 42px;
  top: 35%;
  left: -110px;
  animation: floatRight 22s linear infinite 8s;
}

.cloud5:before {
  width: 52px;
  height: 52px;
  top: -26px;
  left: 18px;
}

.cloud5:after {
  width: 62px;
  height: 42px;
  top: -16px;
  right: 18px;
}

.cloud6 {
  width: 95px;
  height: 38px;
  top: 8%;
  left: -95px;
  animation: floatRight 26s linear infinite 18s;
}

.cloud6:before {
  width: 47px;
  height: 47px;
  top: -24px;
  left: 14px;
}

.cloud6:after {
  width: 57px;
  height: 38px;
  top: -14px;
  right: 14px;
}

.cloud7 {
  width: 130px;
  height: 48px;
  top: 40%;
  left: -130px;
  animation: floatRight 32s linear infinite 25s;
}

.cloud7:before {
  width: 65px;
  height: 65px;
  top: -32px;
  left: 22px;
}

.cloud7:after {
  width: 75px;
  height: 48px;
  top: -22px;
  right: 22px;
}

.cloud8 {
  width: 85px;
  height: 36px;
  top: 18%;
  left: -85px;
  animation: floatRight 24s linear infinite 12s;
}

.cloud8:before {
  width: 42px;
  height: 42px;
  top: -21px;
  left: 12px;
}

.cloud8:after {
  width: 52px;
  height: 36px;
  top: -11px;
  right: 12px;
}

@keyframes floatRight {
  0% {
    left: -150px;
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    left: 100vw;
    transform: translateY(0px);
  }
}

.planes-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.plane {
  position: absolute;
  font-size: 2rem;
  z-index: 1;
}

.plane1 {
  top: 30%;
  left: -50px;
  animation: flyAcross 20s linear infinite;
}

.plane2 {
  top: 45%;
  left: -50px;
  animation: flyAcross 25s linear infinite 12s;
  transform: scaleX(-1);
}

@keyframes flyAcross {
  0% {
    left: -50px;
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(2deg);
  }
  75% {
    transform: translateY(10px) rotate(-1deg);
  }
  100% {
    left: 100vw;
    transform: translateY(0px) rotate(0deg);
  }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatParticles 15s linear infinite;
}

.particle:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.particle:nth-child(2) {
  left: 25%;
  animation-delay: 3s;
  animation-duration: 18s;
}

.particle:nth-child(3) {
  left: 50%;
  animation-delay: 6s;
  animation-duration: 15s;
}

.particle:nth-child(4) {
  left: 75%;
  animation-delay: 9s;
  animation-duration: 20s;
}

.particle:nth-child(5) {
  left: 90%;
  animation-delay: 12s;
  animation-duration: 14s;
}

@keyframes floatParticles {
  0% {
    bottom: -10px;
    opacity: 0;
    transform: translateX(0px);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
    transform: translateX(20px);
  }
}

.lol {
  border: 1px solid;
}
.bannerImage {
  height: 230px;
}

.text {
  display: grid;
}
.separator {
  margin-left: auto;
  margin-right: auto;
}
.abstand {
  margin-bottom: 20px;
}
.bannerIcon {
  size: 30px;
}
.img {
  max-width: 900px;
  min-height: 1200px;
}

@media (max-width: 600px) {
  .img {
    max-width: 900px;
    min-height: 600px;
  }
  .bannerImage {
    height: 130px;
  }
  .oben {
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

  .plane {
    font-size: 1.5rem;
  }

  .sunset-plane {
    font-size: 1.4rem;
  }

  .cloud1,
  .cloud2,
  .cloud3,
  .cloud4 {
    transform: scale(0.7);
  }

  .img-particle {
    width: 3px;
    height: 3px;
  }
}
</style>
