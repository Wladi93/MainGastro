<template>
  <q-page>
    <q-tabs
      v-model="tab"
      activeColor="secondary"
      indicatorColor="secondary"
      narrow-indicator
      inline-label
      class="text-grey-7 text-teal full-width"
    >
      <q-tab name="allgemein" label="allgemein" icon="description" />
      <q-tab name="inhalt" label="inhalt" icon="format_align_center" />
      <q-tab name="logos" label="Logos" icon="image" />
      <q-tab name="hintergrund" label="Hintergrund" icon="wallpaper" />
      <q-tab name="bestellung" label="Bestellung" icon="attach_email" />
      <q-tab name="kontakt" label="kontaktdaten" icon="contact_mail" />
      <q-tab name="anfahrt" label="anfahrt" icon="place" />
      <q-tab name="oeffnungszeiten" label="Öffnungszeiten" icon="schedule" />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="allgemein">
        <AllgemeinSettings />
      </q-tab-panel>

      <q-tab-panel name="inhalt">
        <InhaltSettings />
      </q-tab-panel>

      <q-tab-panel name="logos">
        <LogosSettings />
      </q-tab-panel>

      <q-tab-panel name="hintergrund"><HintergrundSettings /></q-tab-panel>

      <q-tab-panel name="bestellung">
        <BestellMailSettings />
      </q-tab-panel>

      <q-tab-panel name="kontakt">
        <KontaktSettings />
      </q-tab-panel>

      <q-tab-panel name="anfahrt">
        <AnfahrtSettings />
      </q-tab-panel>

      <q-tab-panel name="oeffnungszeiten">
        <OeffnungszeitenSettings />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import AllgemeinSettings from "src/components/AllgemeinSettings.vue";
import InhaltSettings from "src/components/InhaltSettings.vue";
import LogosSettings from "src/components/LogosSettings.vue";
import HintergrundSettings from "src/components/HintergrundSettings.vue";
import KontaktSettings from "src/components/KontaktSettings.vue";
import AnfahrtSettings from "src/components/AnfahrtSettings.vue";
import { ref } from "vue";
import OeffnungszeitenSettings from "src/components/OeffnungszeitenSettings.vue";
import BestellMailSettings from "src/components/BestellMailSettings.vue";

const tab = ref("allgemein");
</script>
