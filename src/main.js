import { createApp } from "vue";
import {createPinia} from "pinia";
// import {devtools} from "@vue/devtools"

import App from "./App.vue";
import appRouter from "./router";

const pinia = createPinia();
const app = createApp(App)

// devtools.connect()

app.use(appRouter)
    .use(pinia)
    .mount("#app");
