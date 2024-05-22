import { createApp } from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import appRouter from "./router";

const pinia = createPinia();

createApp(App)
    .use(appRouter)
    .use(pinia)
    .mount("#app");
