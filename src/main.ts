import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pkg from "../package.json";

console.log(pkg.name + " v" + pkg.version);

createApp(App)
  .use(router)
  .mount("#app");
