import { createRouter, createWebHistory } from "vue-router";

// prettier-ignore
const routes = [
  { 
    path: "/", name: "inicio", component: () => import("@/views/InicioView.vue"),
  },
  { 
    path: "/roles", name: "roles", component: () => import("@/pages/accesos/Roles.vue"),
  },
  { 
    path: "/usuarios", name: "usuarios", component: () => import("@/pages/accesos/Usuarios.vue"),
  },
  { 
    path: "/categorias", name: "categorias", component: () => import("@/pages/almacen/Categorias.vue"),
  },
  {
    path: "/articulos", name: "articulos", component: () => import("@/pages/almacen/Articulos.vue"),
  },
  {
    path: "/ingresos", name: "ingresos", component: () => import("@/pages/compras/Ingresos.vue"),
  },
  // Agrega aquí las demás rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
