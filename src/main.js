import Vue from "vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
// internal icons
import {
  faCheck,
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faAngleUp,
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faEye,
  faEyeSlash,
  faCaretDown,
  faCaretUp,
  faUpload,
  faDownload,
  faSync,
  faExternalLinkAlt,
  faPlusSquare,
  faPlus,
  faCloud,
  faArrowUp,
  faEthernet,
  faCommentAlt,
  faTh,
  faNetworkWired,
  faFilter,
  faObjectGroup,
  faEdit,
  faTimes,
  faProjectDiagram,
  faSpinner,
  faSlidersH,
  faHammer,
  faAlignJustify,
  faExchangeAlt,
  faFrown,
  faBars,
  faRocket,
  faChevronDown,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faCheck,
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faAngleUp,
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faEye,
  faEyeSlash,
  faCaretDown,
  faCaretUp,
  faUpload,
  faDownload,
  faSync,
  faExternalLinkAlt,
  faPlusSquare,
  faPlus,
  faCloud,
  faArrowUp,
  faEthernet,
  faCommentAlt,
  faTh,
  faNetworkWired,
  faFilter,
  faObjectGroup,
  faEdit,
  faTimes,
  faProjectDiagram,
  faSpinner,
  faSlidersH,
  faHammer,
  faAlignJustify,
  faExchangeAlt,
  faFrown,
  faBars,
  faRocket,
  faChevronDown,
  faTrashAlt
);
Vue.component("vue-fontawesome", FontAwesomeIcon);

import Buefy from "buefy";
Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  defaultTooltipType: "is-info"
});

import VueVirtualScroller from "vue-virtual-scroller";

Vue.use(VueVirtualScroller);
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import "buefy/dist/buefy.css";
import router from "./router";

import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);
Vue.loadScript("mxClient.min.js");

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
