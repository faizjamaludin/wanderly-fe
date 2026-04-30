import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./routes/router";

if (localStorage.getItem("wanderly:theme") === "dark") {
  document.documentElement.classList.add("dark");
}

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
