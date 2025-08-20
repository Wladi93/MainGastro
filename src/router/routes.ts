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
      {
        path: "logs",
        component: () => import("pages/AuditLog.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      {
        path: "settingspage",
        component: () => import("pages/SettingsPage.vue"),
        meta: { requiresAdmin: true },
      },
      {
        path: "register",
        component: () => import("pages/RegistrierenPage.vue"),
      },
      { path: "warenkorb", component: () => import("pages/WarenkorbPage.vue") },
      {
        path: "bestellung",
        component: () => import("pages/BestellungAbschliessen.vue"),
      },
      {
        path: "abgeschlossen",
        component: () => import("pages/BestellungAbgeschlossen.vue"),
      },
    ],
  },
  {
    path: "/vorschau1",
    component: () => import("src/components/VorschauPages/VorschauMotiv1.vue"),
  },
  {
    path: "/vorschau2",
    component: () => import("src/components/VorschauPages/VorschauMotiv2.vue"),
  },
  {
    path: "/vorschau3",
    component: () => import("src/components/VorschauPages/VorschauMotiv3.vue"),
  },
  {
    path: "/vorschau4",
    component: () => import("src/components/VorschauPages/VorschauMotiv4.vue"),
  },
  {
    path: "/vorschau5",
    component: () => import("src/components/VorschauPages/VorschauMotiv5.vue"),
  },
  {
    path: "/vorschau6",
    component: () => import("src/components/VorschauPages/VorschauMotiv6.vue"),
  },
  {
    path: "/vorschau7",
    component: () => import("src/components/VorschauPages/VorschauMotiv7.vue"),
  },
  {
    path: "/vorschau8",
    component: () => import("src/components/VorschauPages/VorschauMotiv8.vue"),
  },
];

export default routes;
