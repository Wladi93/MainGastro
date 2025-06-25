import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "impressum", component: () => import("pages/ImpressumPage.vue") },
      { path: "anfahrt", component: () => import("pages/AnfahrtPage.vue") },
      { path: "kontakt", component: () => import("pages/KontakPage.vue") },
      {
        path: "oeffnungszeiten",
        component: () => import("pages/OeffnungszeitenPage.vue"),
      },
      {
        path: "speisekarte",
        component: () => import("pages/SpeisekartePage.vue"),
      },

      { path: "agbs", component: () => import("pages/AGBs.vue") },
      { path: "cookies", component: () => import("pages/cookiesPage.vue") },
      {
        path: "datenschutzerklaerung",
        component: () => import("pages/datenschutzErklärung.vue"),
      },
      {
        path: "wiederrufsrechtsbelehrung",
        component: () => import("pages/wiederrufsrechtsBelehrung.vue"),
      },

      {
        path: "bearbeitung",
        component: () => import("pages/Bearbeiten/BearbeitungApi.vue"),
        meta: { requiresAuth: true },
      },
      { path: "login", component: () => import("pages/LoginPage.vue") },

      {
        path: "unauthorized",
        component: () => import("pages/UnauthorizedPage.vue"),
      },
      {
        path: "account",
        component: () => import("pages/MeinAccount.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "verwaltung",
        component: () => import("pages/AccountVerwaltung.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
];

export default routes;
