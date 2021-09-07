<template>
  <v-container fluid class="px-10">
    <v-row wrap class="mt-3">
      <UserBlogCard
        v-for="blog in blogList"
        :key="blog.id"
        :title="blog.title"
        :content="blog.content"
        :image="blog.imagePath"
        :id="blog.id"
        :likes="blog.likes"
      />
    </v-row>
  </v-container>
</template>

<script>
import UserBlogCard from "../components/UserBlogCard.vue";
import { auth, db } from "../firebase/configs";
export default {
  components: { UserBlogCard },
  data() {
    return {
      blogList: [],
    };
  },
  created() {
    db.collection("Blogs")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapShot) => {
        this.blogList = []
        const userBlog = snapShot.docs.filter((doc) => {
          return doc.data()["userId"] === auth.currentUser.uid;
        });
        userBlog.map((doc) => {
          this.blogList.push({ ...doc.data(), id: doc.id });
        });
      });
  },
};
</script>

<style></style>
