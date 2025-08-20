<template>
  <div class="animated-background">
    <body>
      <div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
    </body>
    <section>
      <div class="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>

    <div class="body"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
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
      <div class="plane plane1"></div>
      <div class="plane plane2"></div>
    </div>
    <div class="sunset-planes">
      <div class="sunset-plane splane1"></div>
      <div class="sunset-plane splane2"></div>
      <div class="sunset-plane splane3"></div>
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
</template>

<script setup lang="ts">
import api from "src/boot/axios";
import { onBeforeUnmount, onMounted } from "vue";

const applyStylesheetFromApi = async () => {
  try {
    const response = await api.get("/api/hintergrund/4");
    const cssPath = response.data.cssName;

    if (cssPath) {
      const link = document.createElement("link");
      link.id = "dynamic-theme";
      link.rel = "stylesheet";
      link.href = cssPath;
      document.head.appendChild(link);
    }
  } catch (error) {
    console.error("Fehler beim Laden des CSS-Themes:", error);
  }
};

onMounted(async () => {
  await applyStylesheetFromApi();
});

onBeforeUnmount(() => {
  const existingLink = document.getElementById("dynamic-theme");
  if (existingLink) {
    existingLink.remove();
  }
});
</script>
