module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    requireConfigFile: false, // <- Esto es lo que evita el error que mencionaste
  },
  rules: {
    // aquí puedes agregar o quitar reglas a tu gusto
    "vue/multi-word-component-names": "off", // Desactivar la regla para nombres de componentes compuestos
  },
};
