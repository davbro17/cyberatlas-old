import Vue from "vue";
import VueRouter from "vue-router";
import Map from "../views/MapView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Map",
    component: Map
  },
  {
    path: "/Extract",
    name: "Extract",
    // route level code-splitting
    // this generates a separate chunk (extract.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "extract" */ "../views/ExtractView.vue")
  },
  {
    path: "/Compare",
    name: "Compare",
    // route level code-splitting
    // this generates a separate chunk (crossref.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CompareView.vue")
  },
  {
    path: "/Merge",
    name: "Merge",
    // route level code-splitting
    // this generates a separate chunk (extract.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "extract" */ "../views/MergeView.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
