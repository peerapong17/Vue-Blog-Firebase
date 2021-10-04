<template>
  <v-container fluid class="px-10 d-flex flex-column align-end">
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
    <template v-else>
      <v-select
        @change="onFilter"
        class="mt-2"
        :items="items"
        label="Date"
        solo
      ></v-select>
      <v-row wrap class="mt-3">
        <template v-if="copiedBlogList.length != 0">
          <BlogCard
            v-for="blog in copiedBlogList"
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
    </template>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BlogCard from "../components/BlogCard.vue";
export default {
  components: { BlogCard },
  data() {
    return {
      items: ["createdAt", "category", "title", "view", "like"],
    };
  },
  created() {
    this.streamBuilder({ field: "createdAt", direction: "desc" });
  },
  methods: {
    ...mapActions(["streamBuilder"]),
    async onFilter(event) {
      if (event == "createdAt") {
        this.streamBuilder({ field: event, direction: "desc" });
      } else {
        this.streamBuilder({ field: event, direction: "asc" });
      }
    },
  },
  computed: {
    ...mapState(["copiedBlogList", "isLoading"]),
    // blogListListener() {
    //   return [...this.blogList];
    // },
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
