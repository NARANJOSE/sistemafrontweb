<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="location"
    :permanent="true"
    :rail="!drawer"
    app
  >
    <v-list density="compact" nav>
      <v-list-item to="/" prepend-icon="mdi-home" title="Inicio" />
      <v-list-group value="almacen">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Almacén" />
        </template>
        <v-list-item
          to="/categorias"
          prepend-icon="mdi-ballot-recount-outline"
          title="Categorías"
          class="tight-text no-spacer"
        />
        <v-list-item
          to="/articulos"
          prepend-icon="mdi-ballot-recount-outline"
          title="Artículos"
          class="tight-text no-spacer"
        />
      </v-list-group>
      <v-list-group value="compras">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Compras" />
        </template>
        <v-list-item
          to="/ingresos"
          prepend-icon="mdi-ballot-recount-outline"
          title="Ingresos"
          class="tight-text no-spacer"
        />
        <v-list-item
          to="/proveedores"
          prepend-icon="mdi-ballot-recount-outline"
          title="Proveedores"
          class="tight-text no-spacer"
        />
      </v-list-group>
      <v-list-group value="ventas">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Ventas" />
        </template>
        <v-list-item
          to="/ventas"
          prepend-icon="mdi-ballot-recount-outline"
          title="Ventas"
          class="tight-text no-spacer"
        />
        <v-list-item
          to="/clientes"
          prepend-icon="mdi-ballot-recount-outline"
          title="Clientes"
          class="tight-text no-spacer"
        />
      </v-list-group>
      <v-list-group value="accesos">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Accesos" />
        </template>
        <v-list-item
          to="/roles"
          prepend-icon="mdi-ballot-recount-outline"
          title="Roles"
          class="tight-text no-spacer"
        />
        <v-list-item
          to="/usuarios"
          prepend-icon="mdi-ballot-recount-outline"
          title="Usuarios"
          class="tight-text no-spacer"
        />
      </v-list-group>
      <v-list-group value="consultas">
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Consultas" />
        </template>
        <v-list-item
          to="/consultasCompras"
          prepend-icon="mdi-ballot-recount-outline"
          title="Consultas Compras"
          class="tight-text no-spacer"
        >
        </v-list-item>
        <v-list-item
          to="/consultasVentas"
          prepend-icon="mdi-ballot-recount-outline"
          title="Consultas Ventas"
          class="tight-text no-spacer"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.tight-text {
  padding-left: 15px !important;
  margin-left: 5px; /* O -16px si quieres más extremo */
}

.no-spacer ::v-deep(.v-list-item__spacer) {
  width: 0 !important;
  margin-left: 20px; /* Ajusta según te guste */
}
</style>

<script setup>
import { ref, defineProps, watch } from "vue";

// Usamos el v-model para enlazar el estado del drawer con App.vue
const props = defineProps({
  modelValue: Boolean,
});

const drawer = ref(props.modelValue);
const location = ref("left");

// Emitimos el evento cada vez que el valor de drawer cambie
watch(
  () => props.modelValue,
  (val) => (drawer.value = val)
);

// watch(drawer, (val) => {
//   if (val !== props.modelValue) {
//     emit("update:modelValue", val); // Sincroniza con el v-model de App.vue
//   }
// });
</script>
