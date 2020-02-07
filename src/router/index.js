import Vue from "vue";
import VueRouter from "vue-router";
import Map from "../views/Map.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "map",
    component: Map
  },
  {
    path: "/extract",
    name: "extract",
    // route level code-splitting
    // this generates a separate chunk (extract.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "extract" */ "../views/Extract.vue")
  },
  {
    path: "/compare",
    name: "compare",
    // route level code-splitting
    // this generates a separate chunk (crossref.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Compare.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
