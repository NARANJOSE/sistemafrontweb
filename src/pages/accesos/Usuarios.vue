<template>
  <v-sheet border rounded>
    <v-data-table
      :search="search"
      :headers="headers"
      :items-per-page-options="[5, 10, 15, 20, 50]"
      :hide-default-footer="registros.length < 6"
      :items="registros"
      item-value="idusuario"
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

            Usuarios
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Agregar Usuario"
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
                @click="edit(item.idusuario)"
              ></v-icon>
            </template>
          </v-tooltip>
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
      :subtitle="`${isEditing ? 'Actualiza' : 'Crea'} tu usuario favorito`"
      :title="`${isEditing ? 'Edita' : 'Agrega'} un usuario`"
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
              <v-select
                v-model="record.idrol"
                :items="roles"
                item-text="title"
                item-value="value"
                label="Roles"
                :rules="rules.roles"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="record.tipo_documento"
                :items="documentos"
                label="Tipo de Documento"
                :rules="rules.tipo_documento"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="record.num_documento"
                label="N° Documento"
                required
                :rules="rules.num_documento"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="record.email"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                :rules="rules.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="record.telefono"
                label="Teléfono"
                placeholder="Ej: +56 9 1234 5678"
                required
                :rules="rules.telefono"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="record.direccion"
                label="Dirección"
                :rules="rules.direccion"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="record.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="********"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="togglePasswordVisibility"
                required
                :rules="rules.password"
              ></v-text-field>
            </v-col>
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
          ¿Confirma activar este usuario?
        </template>
        <template v-else> ¿Confirma desactivar este usuario? </template>
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
  idrol: "",
  nombre: "",
  tipo_documento: "",
  num_documento: "",
  direccion: "",
  telefono: "",
  email: "",
  password: "",
  password_antes: "",
};

const showPassword = ref(false);

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

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
  { title: "ID", key: "idusuario", align: "start" },
  { title: "Nombre", key: "nombre" },
  { title: "Rol", key: "rol", align: "center" },
  { title: "Tipo Documento", key: "tipo_documento" },
  { title: "Numero Documento", key: "num_documento", sortable: false },
  { title: "Email", key: "email", align: "center" },
  { title: "Dirección", key: "direccion" },
  { title: "Teléfono", key: "telefono" },
  { title: "Estado", key: "condicion", align: "center" },
  { title: "Opciones", key: "opciones", align: "end", sortable: false },
];

const registros = ref([]);
const roles = ref([]);
const documentos = ["DNI", "RUC", "PASAPORTE", "CEDULA"];

onMounted(() => {
  reset();
  resetRoles();
});

function add() {
  isEditing.value = false;
  record.value = { ...DEFAULT_RECORD }; // 👈 Copia nueva
  dialog.value = true;
}

function edit(id) {
  isEditing.value = true;

  const found = registros.value.find(
    (itemRegistro) => itemRegistro.idusuario === id
  );

  record.value = {
    idusuario: found.idusuario,
    idrol: found.idrol,
    nombre: found.nombre,
    tipo_documento: found.tipo_documento,
    num_documento: found.num_documento,
    direccion: found.direccion,
    telefono: found.telefono,
    email: found.email,
    password: found.password_hash,
    password_antes: found.password_hash,
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
    (v) => (v && v.length <= 100) || "No debe tener más de 100 caracteres",
  ],
  password: [
    (v) => !!v || "La contraseña es requerida",
    (v) => (v && v.length >= 6) || "Debe tener al menos 6 caracteres",
    // (v) => (v && v.length <= 20) || "No debe tener más de 20 caracteres",
  ],
  email: [
    (v) => !!v || "El correo electrónico es requerido",
    (v) => /.+@.+\..+/.test(v) || "El correo electrónico no es válido",
  ],
  telefono: [(v) => !!v || "El teléfono es requerido"],
  tipo_documento: [(v) => !!v || "Seleccione un tipo de documento"],
  num_documento: [(v) => !!v || "El número de documento es requerido"],
  roles: [(v) => !!v || "Seleccione un tipo de rol"],
};

async function save() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    if (isEditing.value) {
      // Actualizar artículo existente
      if (record.value.password !== record.value.password_antes) {
        record.value.act_password = true;
      }
      await axios.put("api/Usuarios/Actualizar", record.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      successMessage.value = "Usuario actualizado!";
    } else {
      // Crear nuevo Usuario
      await axios.post("api/Usuarios/Crear", record.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      successMessage.value = "¡Usuario guardada exitosamente!";
    }
    snackbarColor.value = "success";
    showSuccess.value = true;
    reset(); // Recarga la tabla
  } catch (error) {
    // Verifica si es un error de respuesta del servidor (400 o 500)
    if (error.response) {
      const { data } = error.response;
      console.log(data);

      successMessage.value = data
        ? data
        : "Error desconocido al guardar la Usuario.";
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
    var Accion = itemToChange.value.condicion ? "Activar" : "Desactivar";
    await axios.put(`api/Usuarios/${Accion}/${itemToChange.value.idusuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    successMessage.value = `Usuario ${
      itemToChange.value.condicion ? "activado" : "desactivado"
    }`;
    snackbarColor.value = "success";
  } catch (error) {
    itemToChange.value.condicion = !itemToChange.value.condicion; // Revertir si falla
    successMessage.value = "No se pudo actualizar el usuario.";
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
    const response = await axios.get("api/Usuarios/Listar");
    console.log(response);
    registros.value = response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}

async function resetRoles() {
  try {
    const response = await axios.get("api/Roles/Seleccionar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    roles.value = response.data.map((c) => ({
      title: c.nombre,
      value: c.idrol,
    }));
  } catch (error) {
    console.error("Error al cargar roles:", error);
  }
}
</script>
