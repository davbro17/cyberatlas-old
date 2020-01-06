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
  faEdit
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
  faEdit
);
Vue.component("vue-fontawesome", FontAwesomeIcon);

import Buefy from "buefy";
Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  defaultTooltipType: "is-info"
});

import "buefy/dist/buefy.css";

new Vue({
  render: h => h(App)
}).$mount("#app");
