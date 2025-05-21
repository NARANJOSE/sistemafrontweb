<template>
  <v-app id="inspire">
    <AppDrawer v-model="drawer" />
    <AppHeader @toggle-drawer="toggleDrawer" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppHeader from "./components/layout/AppHeader.vue";
import AppDrawer from "./components/layout/AppDrawer.vue";
import AppFooter from "./components/layout/AppFooter.vue";

const drawer = ref(true);
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>
