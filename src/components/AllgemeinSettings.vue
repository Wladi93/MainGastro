<template>
  <q-list separator class="q-mt-md">
    <q-item-label> Farben:</q-item-label>
    <div
      class="flex column full-width"
      style="align-items: flex-start; justify-content: flex-start"
    >
      <q-item class="column full-width">
        <div class="row items-center no-wrap" style="width: 100%">
          <div class="text-caption text-grey-7" style="min-width: 50px">
            Layout:
          </div>
          <q-icon color="primary" name="lens" size="sm" class="q-ml-sm" />
        </div>

        <q-item-section>
          <q-btn
            icon="opacity"
            @click="openDialogHauptfarbe"
            label="ändern"
            color="secondary"
            class="full-width q-mt-sm"
          />
        </q-item-section>
        <q-separator class="q-mt-md" />
      </q-item>

      <q-item class="full-width column">
        <div class="row items-center no-wrap" style="width: 100%">
          <div class="text-caption text-grey-7" style="min-width: 50px">
            Buttons:
          </div>
          <q-icon color="secondary" name="lens" size="sm" class="q-ml-sm" />
        </div>

        <q-item-section>
          <q-btn
            icon="opacity"
            @click="openDialogZweitfarbe"
            label="ändern"
            color="secondary"
            class="full-width q-mt-sm"
        /></q-item-section>
        <q-separator class="q-mt-md" />
      </q-item>

      <q-item class="column full-width">
        <div class="row items-center no-wrap" style="width: 100%">
          <div class="text-caption text-grey-7" style="min-width: 50px">
            Chips:
          </div>
          <q-icon color="info" name="lens" size="sm" class="q-ml-sm" />
        </div>

        <q-item-section>
          <q-btn
            icon="opacity"
            @click="openDialogChipfarbe"
            label="ändern"
            color="secondary"
            class="full-width q-mt-sm"
        /></q-item-section>
      </q-item>
    </div>
    <q-separator class="q-mt-md q-mb-md" />
    <q-item-label>Firmenname:</q-item-label>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <div></div>
        <q-item-label caption>Name:</q-item-label>

        <q-input
          label="bitte neuen Namen eingeben"
          filled
          v-model="firma.firmenName"
        >
          <template v-slot:append>
            <q-icon
              name="business"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-xs q-mb-md" />

    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <div></div>
        <q-item-label caption>USt-IdNr.:</q-item-label>

        <q-input
          label="bitte neuen Namen eingeben"
          filled
          v-model="firma.ustIdNr"
        >
          <template v-slot:append>
            <q-icon name="pin" color="secondary" class="cursor-pointer"></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm q-mb-sm" />
    <q-item-label>Anschrift:</q-item-label>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Geschäftsführer:</q-item-label>

        <q-input filled type="text" v-model="firma.geschaeftsführerName">
          <template v-slot:append>
            <q-icon
              name="person"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Straße:</q-item-label>

        <q-input filled type="text" v-model="firma.strasse">
          <template v-slot:append>
            <q-icon
              name="signpost"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Hausnummer:</q-item-label>

        <q-input filled type="text" v-model="firma.hausnummer">
          <template v-slot:append>
            <q-icon
              name="house"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Ort:</q-item-label>

        <q-input filled type="text" v-model="firma.ort">
          <template v-slot:append>
            <q-icon
              name="apartment"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>PLZ:</q-item-label>

        <q-input filled type="text" v-model="firma.plz">
          <template v-slot:append>
            <q-icon name="123" color="secondary" class="cursor-pointer"></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>E-Mail:</q-item-label>

        <q-input filled type="text" v-model="firma.email">
          <template v-slot:append>
            <q-icon
              name="mail"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Telefonnummer:</q-item-label>
        <q-input
          filled
          type="text"
          v-model="firma.telefonnummer"
          placeholder="Telefonnummer"
          @update:model-value="
            (val: string | number | null) => {
              if (val && typeof val === 'string' && !val.startsWith('+49')) {
                if (val.startsWith('0')) {
                  firma.telefonnummer = '+49' + val.substring(1);
                } else {
                  firma.telefonnummer = '+49' + val;
                }
              }
            }
          "
        >
          <template v-slot:append>
            <q-icon
              name="phone_iphone"
              color="secondary"
              class="cursor-pointer"
            ></q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm q-mb-sm" />

    <q-item-label>Lieferando:</q-item-label>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Lieferando-Link:</q-item-label>

        <q-input filled type="text" v-model="firma.lieferando">
          <template v-slot:append>
            <q-icon
              name="takeout_dining"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm q-mb-sm" />

    <q-item-label>Socialmedia:</q-item-label>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Instagram:</q-item-label>

        <q-input filled type="text" v-model="firma.instagram">
          <template v-slot:append>
            <q-icon
              name="photo_camera"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-for="firma in firmenName" :key="firma.id">
      <q-item-section>
        <q-item-label caption>Facebook:</q-item-label>

        <q-input filled type="text" v-model="firma.facebook">
          <template v-slot:append>
            <q-icon
              name="facebook"
              color="secondary"
              class="cursor-pointer"
            ></q-icon
          ></template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-btn
      icon="save"
      class="full-width q-mt-md q-mb-sm"
      color="secondary"
      label="Speichern"
      v-for="firma in firmenName"
      :key="firma.id"
      @click="() => updateFirmenName(firma)"
    />
  </q-list>

  <SettingsFarbeHaupt
    v-model:color1="colorLayout"
    v-model:isOpen="isOpenLayout"
    @change:color1="colorLayout = $event"
  />
  <SettingsFarbeButtons
    v-model:colorButtons="colorButtons"
    v-model:isOpen="isOpenButtons"
    @change:colorButtons="colorButtons = $event"
  />
  <SettingsFarbeChips
    v-model:colorChips="colorChips"
    v-model:isOpen="isOpenChips"
    @change:colorChips="colorChips"
  />
</template>

<script setup lang="ts">
import { useFirmenName } from "src/composables/Firmenname";
import { onMounted, ref } from "vue";
import SettingsFarbeHaupt from "src/components/SettingsFarbeHaupt.vue";
import SettingsFarbeButtons from "src/components/SettingsFarbeButtons.vue";
import SettingsFarbeChips from "src/components/SettingsFarbeChips.vue";

const colorLayout = ref("");
const colorButtons = ref("");
const colorChips = ref("");
const isOpenLayout = ref(false);
const isOpenButtons = ref(false);
const isOpenChips = ref(false);

const { firmenName, loadFirmenName, updateFirmenName } = useFirmenName();

function openDialogHauptfarbe() {
  isOpenLayout.value = true;
}
function openDialogZweitfarbe() {
  isOpenButtons.value = true;
}

function openDialogChipfarbe() {
  isOpenChips.value = true;
}

onMounted(async () => {
  await loadFirmenName();
});
</script>
