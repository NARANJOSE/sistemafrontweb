<template>
  <v-app-bar color="blue-darken-3" dark app>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-toolbar-title>Sistema</v-toolbar-title>
    <v-spacer />
    <v-btn icon>
      <v-icon>mdi-apps</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
// Este componente solo emite el evento "toggle-drawer"
</script>
