import Main from "@/pages/Main.vue";
import { createMemoryHistory, createRouter } from "vue-router";

const routes = [{ path: "/", component: Main }];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
