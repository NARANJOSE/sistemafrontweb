// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labs from "vuetify/labs/components";

export default createVuetify({
  components,
  directives,
  labs,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});
