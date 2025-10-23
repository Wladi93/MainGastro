<template>
  <div class="sticky-tabs">
    <q-banner
      class="banner full-width text-accent bg-white items-center"
      v-for="lieferzeit in lieferzeit"
      :key="lieferzeit.id"
    >
      <div class="row justify-between items-center full-width">
        <h6 class="bannerText">
          <q-icon class="bannerIcon" name="restaurant" />
          Speisekarte
        </h6>

        <q-chip
          v-if="anzeigeLieferzeit"
          color="secondary"
          icon="moped"
          :label="anzeigeLieferzeit"
        />
      </div>
    </q-banner>

    <q-input filled v-model="search" debounce="500" placeholder="Suchen"
      ><template v-slot:append> <q-icon name="search" /> </template
    ></q-input>

    <q-card class="tabsBorder sticky-tabs">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-9"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
        narrow-indicator
        inline-label
        swipeable
        infinite
      >
        <q-tab
          v-for="category in categories"
          :key="category.apiEndpoint"
          @click="onTabChange"
          :name="category.name"
          :label="category.name"
          :icon="category.icon"
        />
      </q-tabs>
    </q-card>
  </div>

  <div class="tab-panels-container">
    <q-card class="background-img"></q-card>

    <div
      v-for="category in categories"
      :key="category.apiEndpoint"
      v-show="true"
      :ref="(el: any) => setSectionRef(category.name, el)"
    >
      <q-card
        v-if="!search.trim() || categoryHasResults(category.name)"
        class="q-gutter-y-xl"
      >
        <div class="tab-section-name">
          <q-card-section class="card-section3 bannerHeight">
            <q-img
              :src="getFullImageUrl(category.bannerImage)"
              spinner-color="white"
              :alt="`${category.name} Banner`"
              style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
              "
            >
              <div
                class="text-white absolute-bottom text-center"
                style="font-size: 18px"
              >
                <q-icon
                  :name="category.icon"
                  color="secondary"
                  size="xs"
                  class="q-mr-xs"
                />
                {{ category.name }}
              </div>
            </q-img>
          </q-card-section>
        </div>
      </q-card>

      <div
        v-for="item in getFilteredCategoryItems(category.name)"
        :key="item.id"
        class="my-card"
      >
        <q-card>
          <q-card-section class="card-section">
            <q-img
              class="imgGericht"
              v-if="item.img"
              :src="getFullImageUrl(item.img)"
              :alt="item.name"
            />
            <div class="text-container">
              <h6
                class="text-h6 row"
                style="display: flex; align-items: center"
              >
                {{ item.name }}
                <q-chip
                  style="background-color: #3de04d"
                  v-if="item.neu == true"
                  label="Neu"
                />
              </h6>
              <p class="description nowrap">{{ item.description }}</p>
            </div>
            <q-separator vertical class="separatorH q-mr-md" />
            <div
              class="column"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div class="flex row items-center q-mb-sm">
                <q-item-label caption>Preis:</q-item-label>
                <q-chip dense color="info"
                  >{{ item.price ? item.price.toFixed(2) : "0.00" }}€</q-chip
                >
              </div>
              <q-btn
                size="sm"
                class="q-mt-xs"
                color="secondary"
                label="hinzufügen"
                @click="
                  () => openZumWarenkorbHinzufügen(item, currentCategoryName)
                "
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <ZumWarenkorbHinzufügenDialog
    v-model:isOpen="isOpenHinzufügen"
    v-model:selectedItem="selectedItem"
    v-model:categoryName="currentCategoryName"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import type { ComponentPublicInstance } from "vue";
import api, { getBaseURL } from "src/boot/axios";
import { useQuasar } from "quasar";
import ZumWarenkorbHinzufügenDialog from "./Dialog/ZumWarenkorbHinzufügenDialog.vue";
import type { Category } from "./types/Category";
import type { CategoryItem } from "./types/CategoryItem";
import type { Lieferzeit } from "./types/LieferzeitType";

const lieferzeit = ref<Lieferzeit[]>([]);

async function loadLieferzeit() {
  try {
    const response = await api.get(`/api/lieferzeit`);
    lieferzeit.value = response.data;
  } catch (error) {
    console.error("Lieferzeit konnte nicht geladen werden", error);
  }
}

const anzeigeLieferzeit = computed(() => {
  const teile = [];
  if (lieferzeit.value[0]!.stunden > 0) {
    teile.push(lieferzeit.value[0]!.stunden + "h");
  }
  if (lieferzeit.value[0]!.minuten > 0) {
    teile.push(lieferzeit.value[0]!.minuten + "min");
  }
  return teile.length > 0 ? teile.join(" ") : "";
});

const scrollTimeout = ref<NodeJS.Timeout | null>(null);
const getFullImageUrl = (imgUrl: string): string => {
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }

  const apiBaseURL = getBaseURL();
  const normalizedBaseURL = apiBaseURL.endsWith("/")
    ? apiBaseURL
    : apiBaseURL + "/";
  const cleanedImgUrl = imgUrl.replace(/^\/+/, "");

  return normalizedBaseURL + cleanedImgUrl;
};
const $q = useQuasar();
const search = ref("");

const categories = ref<Category[]>([]);

// Kategorien
const currentCategoryName = ref("");

const sectionRefs = ref<Record<string, HTMLElement>>({});
const setSectionRef = (
  categoryName: string,
  el: Element | ComponentPublicInstance | null
) => {
  if (el && el instanceof HTMLElement) {
    sectionRefs.value[categoryName] = el;
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get("/api/category");
    categories.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
    $q.notify({
      type: "negative",
      position: "top",
      message: "Fehler beim Laden der Kategorien",
    });
  }
};

// Items
const categoryItems = ref<Record<string, CategoryItem[]>>({
  Pizzen: [],
  Snacks: [],
  Getränke: [],
  Saucen: [],
  Desserts: [],
});

const fetchCategoryItems = async (categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) {
    console.warn(`Category "${categoryName}" not found`);
    return;
  }

  try {
    const response = await api.get(
      `/api/categoryItems/by-category/${category.id}`
    );
    categoryItems.value[categoryName] = response.data;
    categoryItems.value[categoryName]!.sort((a, b) => {
      return a.sortOrder >= b.sortOrder ? 1 : -1;
    });
  } catch (error) {
    console.error(`Error fetching ${categoryName}:`, error);
    $q.notify({
      type: "negative",
      position: "top",
      message: `Fehler beim Laden der ${categoryName}`,
    });
  }
};

const getFilteredCategoryItems = (categoryName: string): CategoryItem[] => {
  const items = categoryItems.value[categoryName] || [];
  if (!search.value.trim()) {
    return items;
  }

  return items.filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  );
};

const categoryHasResults = (categoryName: string): boolean => {
  return getFilteredCategoryItems(categoryName).length > 0;
};

const tab = ref("");
const isUserScrolling = ref(false);

const onTabChange = () => {
  isUserScrolling.value = true;

  const headerOffset = 160;
  const element = sectionRefs.value[tab.value];

  if (element) {
    const elementTop = element.offsetTop;
    const scrollTop = elementTop - headerOffset;

    window.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: "smooth",
    });
  }

  setTimeout(() => {
    isUserScrolling.value = false;
  }, 1500);
};

let observer: IntersectionObserver | null = null;

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (isUserScrolling.value) return;

  // Debounce die Intersection Observer Updates
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }

  scrollTimeout.value = setTimeout(() => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const categoryName = Object.keys(sectionRefs.value).find(
          (key) => sectionRefs.value[key] === entry.target
        );
        if (categoryName) {
          tab.value = categoryName;
        }
      }
    });
  }, 100); // 100ms Debounce
};

// Warenkorb hinzufügen
const isOpenHinzufügen = ref(false);
const selectedItem = ref<CategoryItem | null>(null);

const openZumWarenkorbHinzufügen = (
  item: CategoryItem,
  categoryName: string
) => {
  selectedItem.value = item;
  currentCategoryName.value = categoryName;
  isOpenHinzufügen.value = true;
};

onMounted(async () => {
  await loadLieferzeit();
  await fetchCategories();
  for (const category of categories.value) {
    await fetchCategoryItems(category.name);
  }

  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: "-20px 0px -20px 0px", // Kleinerer Bereich für bessere Performance
    threshold: [0.3, 0.7], // Mehrere Threshold-Werte für stabilere Erkennung
  });

  Object.values(sectionRefs.value).forEach((section) => {
    if (section) observer?.observe(section);
  });
});

onBeforeUnmount(() => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }

  if (observer) {
    Object.values(sectionRefs.value).forEach((section) => {
      if (section) observer?.unobserve(section);
    });
  }
});
</script>

<style scoped>
.bannerHeight {
  height: 180px;
}
.roundedBorders {
  border-radius: 4px;
}
.textOverlay {
  position: relative;
  z-index: 1;
}
.bannerIcon {
  size: 30px;
}

.tabsBorder {
  position: sticky;
  top: 0;
  border: 1px ridge;
  border-color: #ebebeb;
}

.sticky-tabs {
  position: sticky;
  top: 50px;
  z-index: 1;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.my-card {
  background-color: rgb(230, 230, 230);
  max-width: 900px;
  max-width: 100%;
  padding: 0.5%;
  text-align: center;
  box-shadow: 1px 4px 0.2rem rgb(105, 105, 105);
  border: 1px solid;
  border-color: rgb(88, 88, 88);
  overflow: hidden;
  height: auto;
}
.my-card2 {
  margin-top: 1.7%;
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
  width: 98%;
  box-shadow: 1px 1px 0.6rem rgb(0, 0, 0);
  border: 2px solid;
  border-color: #6e6e6e;
  max-height: auto;
  margin-bottom: 40px;
}

.card-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: auto;
}
.card-section2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: 200px;
  box-shadow: 2px 2px 0.4rem rgb(78, 78, 85);
  background-color: rgb(255, 255, 255);
  border: 1px solid;
  border-color: rgb(119, 119, 119);
}
.card-section3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-height: auto;
  box-shadow: 2px 2px 0.4rem rgb(78, 78, 85);
  background-color: rgb(255, 255, 255);
  border: 1px solid;
  border-color: rgb(119, 119, 119);
}
.imgGericht {
  border-radius: 6px;
  aspect-ratio: 1;
  max-width: 80px;
  width: 80px;
  min-width: 80px;
  height: auto;
  box-shadow: 2px 3px 0.2rem rgb(56, 56, 56);
  border: 1px solid;
  border-color: rgb(204, 204, 204);
}

.text-container {
  flex-grow: 1;
  padding-left: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  flex-shrink: 1;
  min-height: 50px;
  max-height: auto;
}

.description {
  font-size: 0.9em;
  color: #666;
  margin-top: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  float: right;
  justify-content: space-between;
}

.select {
  width: 100px;
}
.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("./images/uhr.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.5;
  z-index: -1;
}
.tab-section-name {
  border: 1px solid;
  box-shadow: 2px 2px 0.4rem rgb(0, 0, 0);
}
@media (max-width: 600px) {
  .bannerHeight {
    height: 120px;
  }
  .text-container h6 {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
  }
  .description {
    font-size: 12px;
    width: 98%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .nowrap {
    white-space: nowrap;
  }
  .my-card {
    height: auto;
  }
  .imgGericht {
    min-width: 60px;
    margin-left: -10px;
  }
  .card-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: auto;
    top: 0;
  }
  .card-section3 {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
  }
  .preisText {
    font-size: 12px;
  }
  .my-card2 {
    padding: 0;
    margin-bottom: 0;
  }
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
