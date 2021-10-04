import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import ForgetPassword from "../views/auth/ForgetPassword.vue";
import Home from "../views/Home.vue";
import CreateBlog from "../views/blog/CreateBlog.vue";
import BlogDetail from "../views/blog/BlogDetail.vue";
import UserBlog from "../views/blog/UserBlog.vue";
import EditBlog from "../views/blog/EditBlog.vue";
import BlogFilteredByCategory from "../views/blog/BlogFilteredByCategory.vue";
import { auth } from "../firebase/configs";

Vue.use(VueRouter);

const authGuard = (to, from, next) => {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      next({ name: "Login" });
    } else {
      next();
    }
  });
};

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgetPassword",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: authGuard,
  },
  {
    path: "/create-blog",
    name: "Create-Blog",
    component: CreateBlog,
    beforeEnter: authGuard,
  },
  {
    path: "/blog/category/:category",
    name: "GetBlogByCategory",
    component: BlogFilteredByCategory,
    props: true
  },
  {
    path: "/blog-detail/:blog_id",
    name: "Blog-Detail",
    component: BlogDetail,
    beforeEnter: authGuard,
  },
  {
    path: "/user-blog",
    name: "User-Blog",
    component: UserBlog,
    beforeEnter: authGuard,
  },
  {
    path: "/edit-blog/:blog_id",
    name: "Edit-Blog",
    component: EditBlog,
    beforeEnter: authGuard,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
