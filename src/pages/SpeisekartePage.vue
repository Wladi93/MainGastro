<template>
  <div class="sticky-tabs">
    <q-banner class="banner full-width text-accent">
      <h6 class="bannerText">
        <q-icon class="bannerIcon" name="restaurant" />
        Speisekarte
      </h6>
    </q-banner>

    <div class="above bg-white">
      <q-separator color="accent" />
      <h2 class="textOben text-h5 text-weight-thin text-center">
        Unsere Speisekarte...
      </h2>
      <q-separator size="15px" color="grey-6" class="separatorOben" />
    </div>

    <q-img class="background-img" />
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
      :ref="(el) => setSectionRef(category.name, el)"
    >
      <q-card class="q-gutter-y-xl">
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
        v-for="item in getCategoryItems(category.name)"
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
              <h6 class="text-h6">
                {{ item.name }}
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
              <h6 class="preisText text-subtitle2">Preis:</h6>
              <q-chip color="green-6"
                >{{ item.price ? item.price.toFixed(2) : "0.00" }}€</q-chip
              >
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { ComponentPublicInstance } from "vue";
import api from "src/boot/axios";
import { useQuasar } from "quasar";

const getFullImageUrl = (imgUrl: string): string => {
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  return api.defaults.baseURL + imgUrl.replace(/^\/+/, "");
};

const $q = useQuasar();

interface ItemSizes {
  sizeName: string;
  price: number;
  categoryItemId: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  apiEndpoint: string;
  bannerImage: string;
  categoryItem?: CategoryItem[];
}

interface CategoryItem {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  categoryId: number;
  hasSizes: boolean;
  sizes?: ItemSizes[];
}

const categories = ref<Category[]>([]);

// Kategorien

const getCategoryItems = (categoryName: string): CategoryItem[] => {
  return categoryItems.value[categoryName] || [];
};

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
  } catch (error) {
    console.error(`Error fetching ${categoryName}:`, error);
    $q.notify({
      type: "negative",
      message: `Fehler beim Laden der ${categoryName}`,
    });
  }
};

const tab = ref("");
const isUserScrolling = ref(false);

const onTabChange = () => {
  console.log(tab.value);
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
  }, 1000);
};

let observer: IntersectionObserver | null = null;

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (isUserScrolling.value) return;

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
};

onMounted(async () => {
  await fetchCategories();
  for (const category of categories.value) {
    await fetchCategoryItems(category.name);
  }

  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  Object.values(sectionRefs.value).forEach((section) => {
    if (section) observer?.observe(section);
  });
});

onBeforeUnmount(() => {
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
