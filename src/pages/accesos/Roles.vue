<template>
  <v-sheet border rounded>
    <v-data-table
      :search="search"
      :headers="headers"
      :hide-default-footer="registros.length < 11"
      :items="registros"
      item-value="idRol"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-blur"
              size="x-small"
              start
            ></v-icon>

            Roles
          </v-toolbar-title>
        </v-toolbar>

        <v-card-title class="d-flex align-center pe-2">
          <v-icon icon=""></v-icon> &nbsp;
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            density="compact"
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
          ></v-text-field>
        </v-card-title>
      </template>

      <!-- eslint-disable -->
      <template v-slot:item.condicion="{ value }">
        <div class="d-flex justify-center align-center w-100">
          <v-chip
            :color="value ? 'success' : 'error'"
            :text="value ? 'Activo' : 'Inactivo'"
            size="small"
            class="text-white"
            label
          />
        </div>
      </template>

      <!-- eslint-enable -->

      <template v-slot:no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Refrescar"
          variant="text"
          border
          @click="reset"
        ></v-btn>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useDate } from "vuetify";
import axios from "axios"; // ✅ Importar axios

// eslint-disable-next-line
const adapter = useDate();

const DEFAULT_RECORD = {
  nombre: "",
  descripcion: "",
  condicion: false,
};

const registros = ref([]);
const record = ref(DEFAULT_RECORD);
const search = ref("");
// eslint-disable-next-line
const token = localStorage.getItem("token");

const headers = [
  { title: "ID", key: "idrol", align: "start" },
  { title: "Nombre", key: "nombre" },
  { title: "Descripción", key: "descripcion" },
  { title: "Estado", key: "condicion", align: "center" },
];

onMounted(() => {
  reset();
});

async function reset() {
  record.value = DEFAULT_RECORD;

  try {
    const response = await axios.get("api/Roles/Listar");
    console.log(response);
    registros.value = response.data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
}
</script>
