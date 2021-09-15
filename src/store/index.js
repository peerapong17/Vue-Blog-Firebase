import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [
      { title: "Home", icon: "mdi-home", link: "Home" },
      { title: "Create", icon: "mdi-pencil", link: "Create-Blog" },
      {
        title: "Your Post",
        icon: "mdi-folder-star-multiple",
        link: "User-Blog",
      },
    ],
  },
  mutations: {
  },
  actions: {
    
  },
  modules: {},
});
