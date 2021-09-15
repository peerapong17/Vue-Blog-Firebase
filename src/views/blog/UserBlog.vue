<template>
  <v-container fluid class="px-10">
    <v-row justify="center" v-if="isLoading">
      <v-progress-circular
      :size="50"
      color="black"
      indeterminate
      class="spinner"
    ></v-progress-circular>
    </v-row>
    <v-row justify="start" class="mt-3" v-else>
      <template  v-if="blogListListener.length != 0">
        <UserBlogCard
          v-for="blog in blogListListener"
          :key="blog.id"
          :title="blog.title"
          :content="blog.content"
          :imageUrl="blog.imageUrl"
          :id="blog.id"
          :likes="blog.likes"
        />
      </template>
      <div v-else class="noBlog">
        <h1>There is no blog...</h1>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { auth, db } from "../../firebase/configs";
import UserBlogCard from "../../components/UserBlogCard.vue";
export default {
  components: { UserBlogCard },
  data() {
    return {
      blogList: [],
      isLoading: true,
    };
  },
  created() {
    db.collection("Blogs")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapShot) => {
        this.isLoading = false;
        this.blogList = [];
        const userBlog = snapShot.docs.filter((doc) => {
          return doc.data()["userId"] === auth.currentUser.uid;
        });
        userBlog.map((doc) => {
          this.blogList.push({ ...doc.data(), id: doc.id });
        });
      });
  },
  computed: {
    blogListListener() {
      return [...this.blogList];
    },
  },
};
</script>

<style scoped>
.spinner {
  margin-top: 100px;
}

.noBlog {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 100px;
  font-size: 30px;
}
</style>
