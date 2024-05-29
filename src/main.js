import { createApp } from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import appRouter from "./router";

const pinia = createPinia();
const app = createApp(App)

app.use(appRouter)
    .use(pinia)
    .mount("#app");
