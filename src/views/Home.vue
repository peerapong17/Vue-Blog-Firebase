<template>
  <v-container fluid class="px-10">
    <v-row justify="center" class="mt-16" v-if="blogList.length == 0">
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
      <BlogCard
        v-for="blog in blogList"
        :key="blog.id"
        :title="blog.title"
        :content="blog.content"
        :image="blog.imagePath"
        :id="blog.id"
        :likes="blog.likes"
        :createdAt="blog.createdAt"
        :category="blog.category"
      />
    </v-row>
  </v-container>
</template>

<script>
import BlogCard from "../components/BlogCard.vue";
import { mapActions } from "vuex";
import { db } from "../firebase/configs";
export default {
  components: { BlogCard },
  data() {
    return {
      blogList: [],
    };
  },
  created() {
    db.collection("Blogs")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapShot) => {
        this.blogList = [];
        snapShot.docs.map((doc) => {
          this.blogList.push({ ...doc.data(), id: doc.id });
        });
      });
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  computed: {},
};
</script>

<style></style>
