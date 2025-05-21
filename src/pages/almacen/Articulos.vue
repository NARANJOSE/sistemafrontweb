<template>
  <v-sheet border rounded>
    <v-data-table
      :search="search"
      :headers="headers"
      :hide-default-footer="registros.length < 11"
      :items="registros"
      item-value="idarticulo"
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

            Artículos
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Agregar Artículo"
            border
            @click="add"
          ></v-btn>
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
      <!-- Esto es para colocar un icono al registro -->
      <!-- <template v-slot:item.nombre="{ value }">
        <v-chip
          :text="value"
          border="thin opacity-25"
          prepend-icon="mdi-book"
          label
        >
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template> -->
      <!-- eslint-enable -->

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

      <template v-slot:item.opciones="{ item }">
        <div class="d-flex ga-2 justify-end">
          <!-- Switch para activar/desactivar -->
          <v-tooltip text="Estado" location="top">
            <template v-slot:activator="{ props }">
              <v-switch
                v-bind="props"
                v-model="item.condicion"
                color="success"
                hide-details
                density="compact"
                style="transform: scale(0.6)"
                @change="confirmChange(item)"
              ></v-switch>
            </template>
          </v-tooltip>
          <v-divider class="mx-1" vertical></v-divider>

          <!-- Icono editar -->
          <v-tooltip text="Editar" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="medium-emphasis"
                icon="mdi-pencil"
                size="small"
                style="margin-top: 10px"
                @click="edit(item.idarticulo)"
              ></v-icon>
            </template>
          </v-tooltip>

          <!-- <v-divider class="mx-1" vertical></v-divider> -->

          <!-- Icono eliminar -->
          <!-- <v-tooltip text="Eliminar" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="medium-emphasis"
                icon="mdi-delete"
                size="small"
                style="margin-top: 10px"
                @click="remove(item.idCategoria)"
              ></v-icon>
            </template>
          </v-tooltip> -->
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

  <v-dialog v-model="dialog" max-width="800">
    <v-card
      :subtitle="`${isEditing ? 'Actualiza' : 'Crea'} tu artículo favorito`"
      :title="`${isEditing ? 'Edita' : 'Agrega'} un artículo`"
    >
      <v-form ref="form">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="record.nombre"
                label="Nombre"
                :rules="rules.nombre"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="record.codigo"
                label="Código"
                :rules="rules.codigo"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="record.descripcion"
                label="Descripción"
                :rules="rules.descripcion"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="record.precio_venta"
                class="no-spinner"
                type="number"
                label="Precio de Venta"
                :rules="rules.precio_venta"
                :min="0"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-number-input
                v-model="record.stock"
                label="Stock"
                control-variant="stacked"
                :min="0"
              ></v-number-input>
            </v-col>
            <v-col cols="12" sm="12">
              <v-select
                v-model="record.idcategoria"
                :items="categorias"
                label="Categorías"
                :rules="rules.categoria"
              ></v-select>
            </v-col>

            <!-- <v-col cols="12" md="6">
            <v-select
              v-model="record.genre"
              :items="['Fiction', 'Dystopian', 'Non-Fiction', 'Sci-Fi']"
              label="Genre"
            ></v-select>
          </v-col> -->
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="bg-surface-light">
          <v-btn
            text="Cancelar"
            variant="plain"
            @click="dialog = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Guardar" @click="save"></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showConfirm" max-width="400">
    <v-card>
      <v-card-title class="text-h6">¿Confirmar acción?</v-card-title>
      <v-card-text>
        <template v-if="itemToChange && itemToChange.condicion">
          ¿Confirma activar este artículo?
        </template>
        <template v-else> ¿Confirma desactivar este artículo? </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="
            showConfirm = false;
            itemToChange.condicion = !itemToChange.condicion;
          "
          >Cancelar
        </v-btn>
        <v-btn color="primary" @click="executeChange">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="showSuccess"
    :color="snackbarColor"
    timeout="3000"
    location="top"
    multi-line
    elevation="6"
    rounded="xl"
  >
    <template #default>
      <div class="d-flex align-center">
        <v-icon start class="me-2" size="24">
          {{
            snackbarColor === "success"
              ? "mdi-check-circle-outline"
              : "mdi-alert-circle-outline"
          }}
        </v-icon>
        <span>{{ successMessage }}</span>
      </div>
    </template>
  </v-snackbar>
</template>

<style scoped>
.no-spinner ::v-deep input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.no-spinner ::v-deep input[type="number"]::-webkit-inner-spin-button,
.no-spinner ::v-deep input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

<script setup>
import { onMounted, ref, shallowRef } from "vue";
import axios from "axios"; // ✅ Importar axios

const DEFAULT_RECORD = {
  nombre: "",
  codigo: "",
  descripcion: "",
  precio_venta: 0,
  stock: 0,
  idCategoria: 0,
  condicion: false,
};

const record = ref(DEFAULT_RECORD);
const dialog = shallowRef(false);
const isEditing = shallowRef(false);
const search = ref("");
// eslint-disable-next-line
const token = localStorage.getItem("token");

const snackbarColor = ref("success");
const successMessage = ref("");
const showSuccess = ref(false);

const headers = [
  { title: "ID", key: "idarticulo", align: "start" },
  { title: "Nombre", key: "nombre" },
  { title: "Código", key: "codigo", align: "center" },
  { title: "Categoría", key: "categoria" },
  { title: "Stock", key: "stock" },
  { title: "Precio Venta", key: "precio_venta" },
  { title: "Descripción", key: "descripcion" },
  { title: "Estado", key: "condicion", align: "center" },
  { title: "Opciones", key: "opciones", align: "end", sortable: false },
];

const registros = ref([]);
const categorias = ref([]);
onMounted(() => {
  reset();
  resetCategorias();
});

function add() {
  isEditing.value = false;
  record.value = { ...DEFAULT_RECORD }; // 👈 Copia nueva
  dialog.value = true;
}

function edit(id) {
  isEditing.value = true;

  const found = registros.value.find(
    (itemRegistro) => itemRegistro.idarticulo === id
  );

  record.value = {
    idarticulo: found.idarticulo,
    nombre: found.nombre,
    codigo: found.codigo,
    descripcion: found.descripcion,
    precio_venta: found.precio_venta,
    stock: found.stock,
    idcategoria: found.idcategoria,
  };

  dialog.value = true;
}

// function remove(id) {
//   const index = registros.value.findIndex((book) => book.id === id);
//   registros.value.splice(index, 1);
// }

const form = ref(null);
const rules = {
  nombre: [
    (v) => !!v || "El nombre es requerido",
    (v) => (v && v.length >= 3) || "Debe tener al menos 3 caracteres",
    (v) => (v && v.length <= 50) || "No debe tener más de 50 caracteres",
  ],
  codigo: [(v) => !!v || "El código es requerido"],
  descripcion: [
    (v) => !!v || "La descripción es requerida",
    (v) => (v && v.length <= 100) || "Máximo 100 caracteres permitidos",
  ],
  categoria: [(v) => !!v || "Seleccione una categoría"],
  precio_venta: [
    (v) => !!v || "Debe agregar un precio",
    (v) => v > 0 || "El precio debe ser mayor a 0",
  ],
};

async function save() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    if (isEditing.value) {
      // Actualizar artículo existente
      await axios.put("api/Articulos/Actualizar", record.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      successMessage.value = "¡Artículo actualizado!";
    } else {
      // Crear nueva artículo
      await axios.post("api/Articulos/Crear", record.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      successMessage.value = "¡Artículo guardada exitosamente!";
    }
    snackbarColor.value = "success";
    showSuccess.value = true;
    reset(); // Recarga la tabla
  } catch (error) {
    // Verifica si es un error de respuesta del servidor (400 o 500)
    if (error.response) {
      const { data } = error.response;
      successMessage.value =
        data?.mensaje || "Error desconocido al guardar la Artículo.";
    } else {
      // Error de red u otro tipo
      successMessage.value =
        "Error de conexión o inesperado. Intente de nuevo.";
      console.error("Error inesperado:", error);
    }

    snackbarColor.value = "error";
    showSuccess.value = true;
  }
}

const showConfirm = ref(false);
const itemToChange = ref(null);

async function confirmChange(item) {
  itemToChange.value = item;
  showConfirm.value = true;
}

async function executeChange() {
  if (
    !itemToChange.value ||
    typeof itemToChange.value.condicion === "undefined"
  )
    return;

  try {
    await axios.put(
      `api/Articulos/ActivarDesactivar/${itemToChange.value.idarticulo}`,
      { condicion: itemToChange.value.condicion },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    successMessage.value = `Artículo ${
      itemToChange.value.condicion ? "activada" : "desactivada"
    }`;
    snackbarColor.value = "success";
  } catch (error) {
    itemToChange.value.condicion = !itemToChange.value.condicion; // Revertir si falla
    successMessage.value = "No se pudo actualizar el artículo";
    snackbarColor.value = "error";
  } finally {
    showConfirm.value = false;
    itemToChange.value = null;
    showSuccess.value = true;
  }
}

async function reset() {
  dialog.value = false;
  record.value = DEFAULT_RECORD;

  try {
    const response = await axios.get("api/Articulos/Listar");
    console.log(response);
    registros.value = response.data;
  } catch (error) {
    console.error("Error al obtener los artículos:", error);
  }
}

async function resetCategorias() {
  try {
    const response = await axios.get("api/Categorias/Seleccionar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    categorias.value = response.data.map((c) => ({
      title: c.nombre,
      value: c.idCategoria,
    }));
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}
</script>
