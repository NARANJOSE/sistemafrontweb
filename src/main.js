import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import axios from "axios";

loadFonts();
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
// prettier-ignore
createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
