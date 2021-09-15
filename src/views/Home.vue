<template>
  <v-container fluid class="px-10">
    <v-row justify="center" class="mt-16" v-if="isLoading">
      <v-col class="md-4">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          height="350"
          width="100%"
          type="card"
        ></v-skeleton-loader>
      </v-col>
      <v-col class="md-4">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          width="100%"
          type="card"
        ></v-skeleton-loader>
      </v-col>
      <v-col class="md-4">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          width="100%"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row wrap class="mt-3" v-else>
      <template v-if="blogListListener.length != 0">
        <BlogCard
          v-for="blog in blogListListener"
          :key="blog.id"
          :title="blog.title"
          :content="blog.content"
          :imageUrl="blog.imageUrl"
          :id="blog.id"
          :likes="blog.likes"
          :createdAt="blog.createdAt"
          :category="blog.category"
        />
      </template>
      <div v-else class="noBlog">
        <h1>There is no blog...</h1>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../firebase/configs";
import BlogCard from "../components/BlogCard.vue";
export default {
  components: { BlogCard },
  data() {
    return {
      isLoading: true,
      blogList: [],
    };
  },
  created() {
    db.collection("Blogs")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapShot) => {
        console.log(snapShot)
        this.isLoading = false;
        this.blogList = [];
        snapShot.docs.map((doc) => {
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

<style>
.noBlog {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 100px;
  font-size: 30px;
}
</style>
