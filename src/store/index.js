import Vue from "vue";
import Vuex from "vuex";
import { db } from "../firebase/configs";

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
    blogList: [],
    copiedBlogList: [],
    isLoading: false,
  },
  mutations: {
    gotData(state, payload) {
      state.blogList = payload;
      state.copiedBlogList = payload;
    },
    isLoading(state) {
      state.isLoading = true;
    },
    isNotLoading(state) {
      state.isLoading = false;
    },
    getBlogBySearchInput(state, value){
      state.copiedBlogList = [...state.blogList].filter((blog)=>{
        return blog.title.includes(value)
      })
    },
  },
  actions: {
    streamBuilder(context, payload) {
      return db.collection("Blogs")
        .orderBy(payload["field"], payload["direction"])
        .onSnapshot((snapShot) => {
          context.commit("isLoading");
          console.log(snapShot);
          var snapShotList = [];
          this.isLoading = false;
          this.blogList = [];
          snapShot.docs.map((doc) => {
            snapShotList.push({ ...doc.data(), id: doc.id });
          });
          context.commit("isNotLoading");
          context.commit("gotData", snapShotList);
        });
    },

    fetchBlogByCategory(context, payload) {
      console.log(payload)
      db.collection("Blogs")
        .orderBy("createdAt", "desc")
        .where("category", "==", payload)
        .onSnapshot((snapShot) => {
          context.commit("isLoading");
          console.log(snapShot);
          var snapShotList = [];
          this.isLoading = false;
          this.blogList = [];
          snapShot.docs.map((doc) => {
            snapShotList.push({ ...doc.data(), id: doc.id });
          });
          context.commit("isNotLoading");
          context.commit("gotData", snapShotList);
        });
    },
  },
  modules: {},
});
