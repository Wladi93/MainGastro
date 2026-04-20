<template>
  <div class="app-container">
    
    <div class="glass-header">
      <div v-if="lieferzeit.length" class="row justify-between items-center q-px-md q-pt-md">
        <div class="row items-center">
          <div class="logo-dot q-mr-sm"></div>
          <span class="text-h6 text-white text-weight-bolder">SPEISEKARTE</span>
        </div>
        
        <div v-if="anzeigeLieferzeit" class="delivery-pill">
          <q-icon name="moped" size="xs" class="q-mr-xs" color="secondary" />
          {{ anzeigeLieferzeit }}
        </div>
      </div>

      <div class="q-px-md q-py-md">
        <q-input 
          borderless 
          dense
          v-model="search" 
          placeholder="Finde dein Lieblingsessen..." 
          class="search-glass"
          input-class="text-grey-5"
          
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-4" />
          </template>
        </q-input>
      </div>

      <div ref="navContainerRef" class="categories-nav q-pl-md q-pb-md">
        <div 
          v-for="category in categories"
          :key="category.apiEndpoint"
          @click="onTabChange(category.name)"
          class="nav-pill"
          :class="{ 'pill-active': tab === category.name }"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

    <div class="content-scrollable">
      <div
        v-for="category in categories"
        :key="category.apiEndpoint"
        v-show="!search.trim() || categoryHasResults(category.name)"
        :ref="(el: any) => setSectionRef(category.name, el)"
        class="category-block"
      >
        <div class="category-hero">
          <q-img :src="getFullImageUrl(category.bannerImage)" class="hero-img">
            <div class="hero-overlay full-width full-height flex items-end">
              <div class="q-pa-lg">
                <div class="text-overline text-secondary text-weight-bold">ENTDECKE</div>
                <div class="text-h4 text-white text-weight-bolder">{{ category.name }}</div>
              </div>
            </div>
          </q-img>
        </div>

        <div class="items-container q-px-md">
          <div
            v-for="item in getFilteredCategoryItems(category.name)"
            :key="item.id"
            class="premium-glass-card"
            @click="openZumWarenkorbHinzufügen(item, category.name)"
          >
            <div class="card-inner">
              <div class="card-body">
                <div class="text-subtitle1 text-white text-weight-bold flex items-center">{{ item.name }}
                              <q-chip
                  class="bg-secondary text-white q-ml-sm"
                  style="justify-content: center; align-items: center;"
                  v-if="item.neu == true"
                  label="Neu"
                  :text-color="schriftFarbe ? 'white' : 'black'"
                />
                </div>
                <p class="card-desc">{{ item.description }}</p>
                <div class="price-box">
                  {{ item.price ? item.price.toFixed(2) : "0.00" }} <span class="currency">€</span>
                </div>
              </div>

              <div class="card-media">
                <q-img :src="getFullImageUrl(item.img)" class="item-img shadow-10">
                   <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-10">
                      <q-icon name="restaurant" color="grey-8" />
                    </div>
                  </template>
                </q-img>
                <q-btn
                  round
                  unelevated
                  color="secondary"
                  icon="add"
                  size="sm"
                  :text-color="schriftFarbe ? 'white' : 'black'"
                  class="add-btn-over"
                  @click.stop="openZumWarenkorbHinzufügen(item, category.name)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ZumWarenkorbHinzufügenDialog
      v-model:isOpen="isOpenHinzufügen"
      v-model:selectedItem="selectedItem"
      v-model:categoryName="currentCategoryName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue";
import type { ComponentPublicInstance } from "vue";
import api, { getBaseURL } from "src/boot/axios";
import ZumWarenkorbHinzufügenDialog from "./Dialog/ZumWarenkorbHinzufügenDialog.vue";
import type { Category } from "./types/Category";
import type { CategoryItem } from "./types/CategoryItem";
import type { Lieferzeit } from "./types/LieferzeitType";

const lieferzeit = ref<Lieferzeit[]>([]);
const search = ref("");
const categories = ref<Category[]>([]);
const currentCategoryName = ref("");
const tab = ref("");
const isUserScrolling = ref(false);
const sectionRefs = ref<Record<string, HTMLElement>>({});
const isOpenHinzufügen = ref(false);
const selectedItem = ref<CategoryItem | null>(null);
const categoryItems = ref<Record<string, CategoryItem[]>>({});

const schriftFarbe = ref<boolean>(false);

  async function loadSchriftFarbe() {
  try {
    const res = await api.get("api/color/2");
    if (res.data) {
      schriftFarbe.value = Boolean(res.data.schriftFarbe);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Schriftfarbe", error);
  }
}

const getFullImageUrl = (imgUrl: string): string => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith("http")) return imgUrl;
  const apiBaseURL = getBaseURL();
  return `${apiBaseURL.replace(/\/$/, '')}/${imgUrl.replace(/^\/+/, '')}`;
};

const loadLieferzeit = async () => {
  try {
    const response = await api.get(`/api/lieferzeit`);
    lieferzeit.value = response.data;
  } catch (e) { console.error(e); }
};

const anzeigeLieferzeit = computed(() => {
  if (!lieferzeit.value.length) return "";
  const { stunden, minuten } = lieferzeit.value[0]!;
  const parts = [];
  if (stunden > 0) parts.push(`${stunden}h`);
  if (minuten > 0) parts.push(`${minuten}min`);
  return parts.join(" ");
});

const fetchCategories = async () => {
  try {
    const response = await api.get("/api/category");
    categories.value = response.data;
    // WICHTIG: Kategorien nach sortOrder sortieren, wie in Code 1
    categories.value.sort((a, b) => {
      return a.sortOrder >= b.sortOrder ? 1 : -1;
    });
    if (categories.value.length > 0) tab.value = categories.value[0]!.name;
  } catch (e) { console.error(e); }
};

const fetchCategoryItems = async (categoryName: string) => {
  const category = categories.value.find((c) => c.name === categoryName);
  if (!category) return;
  try {
    const response = await api.get(`/api/categoryItems/by-category/${category.id}`);
    categoryItems.value[categoryName] = response.data.sort((a: CategoryItem, b: CategoryItem) => a.sortOrder - b.sortOrder);
  } catch (e) { console.error(e); }
};

const getFilteredCategoryItems = (categoryName: string): CategoryItem[] => {
  const items = categoryItems.value[categoryName] || [];
  return !search.value.trim() 
    ? items 
    : items.filter(i => i.name.toLowerCase().includes(search.value.toLowerCase()));
};

const categoryHasResults = (categoryName: string): boolean => getFilteredCategoryItems(categoryName).length > 0;

const setSectionRef = (categoryName: string, el: Element | ComponentPublicInstance | null) => {
  if (el && el instanceof HTMLElement) sectionRefs.value[categoryName] = el;
};

const onTabChange = (categoryName: string) => {
  tab.value = categoryName;
  isUserScrolling.value = true;
  const element = sectionRefs.value[categoryName];
  if (element) {
    const offset = 180; 
    window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
  }
  setTimeout(() => { isUserScrolling.value = false; }, 1000);
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  if (isUserScrolling.value) return;
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const name = Object.keys(sectionRefs.value).find(k => sectionRefs.value[k] === entry.target);
      if (name) tab.value = name;
    }
  });
};

const openZumWarenkorbHinzufügen = (item: CategoryItem, catName: string) => {
  selectedItem.value = item;
  currentCategoryName.value = catName;
  isOpenHinzufügen.value = true;
};

let observer: IntersectionObserver | null = null;

const navContainerRef = ref<HTMLElement | null>(null);

  watch(tab, async () => {
  await nextTick(); 
  
  if (!navContainerRef.value) return;

  const activePill = navContainerRef.value.querySelector('.pill-active') as HTMLElement;
  
  if (activePill) {
    const containerWidth = navContainerRef.value.clientWidth;
    const pillLeft = activePill.offsetLeft;
    const pillWidth = activePill.clientWidth;
    const scrollPos = pillLeft - (containerWidth / 2) + (pillWidth / 2);

    navContainerRef.value.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  }
});

onMounted(async () => {
  await loadSchriftFarbe();
  await loadLieferzeit();
  await fetchCategories();
  for (const cat of categories.value) { await fetchCategoryItems(cat.name); }
  observer = new IntersectionObserver(handleIntersection, { rootMargin: "-20% 0px -60% 0px" });
  Object.values(sectionRefs.value).forEach(s => observer?.observe(s));
});

onBeforeUnmount(() => { observer?.disconnect(); });
</script>

<style scoped>
.app-container {
  background: radial-gradient(circle at top right, #1a1a1a, #050505);
  min-height: 100vh;
  color: white;
  padding-top: 60px;
  
}

.glass-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--q-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--q-secondary);
}

.delivery-pill {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
}

.search-glass {
  background: rgba(255,255,255,0.06);
  border-radius: 15px;
  padding: 2px 15px;
  border: 1px solid rgba(255,255,255,0.05);
}

.categories-nav {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scrollbar-width: none;
}
.categories-nav::-webkit-scrollbar { display: none; }

.nav-pill {
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.03);
  color: #777;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid transparent;
}
.pill-active {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: var(--q-secondary);
}

.category-block { margin-bottom: 50px; }

.category-hero {
  height: 220px;
  margin-bottom: -40px;
  border-radius: 0 0 40px 40px;
  overflow: hidden;
}
.hero-img { height: 100%; width: 100%; }
.hero-overlay {
  background: linear-gradient(to bottom, transparent 20%, #050505 100%);
}

.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  margin-bottom: 20px;
  transition: transform 0.3s;
  cursor: pointer;
}
.premium-glass-card:active { transform: scale(0.97); }

.card-inner {
  display: flex;
  padding: 16px;
  gap: 16px;
}

.card-body { flex: 1; display: flex; flex-direction: column; }
.card-desc {
  color: #888;
  font-size: 13px;
  line-height: 1.4;
  margin: 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-box {
  margin-top: auto;
  font-size: 18px;
  font-weight: 800;
  color: var(--q-secondary);
}
.currency { font-size: 12px; opacity: 0.6; }

.card-media { position: relative; width: 110px; height: 110px; }
.item-img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.add-btn-over {
  position: absolute;
  bottom: -8px;
  right: -8px;
  border: 4px solid #0a0a0a;
}

@media (min-width: 800px) {
  .items-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>