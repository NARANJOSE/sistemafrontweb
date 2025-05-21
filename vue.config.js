const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 👈 Esto desactiva el plugin de ESLint en tiempo de compilación

  pluginOptions: {
    vuetify: {
      // vuetify-loader config
    },
  },
});
