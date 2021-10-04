<template>
  <v-container fluid class="px-10 d-flex flex-column align-end">
    <v-select
      @change="onFilter"
      class="mt-2"
      :items="items"
      label="Date"
      solo
    ></v-select>
    <v-row wrap>
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
    </v-row>
  </v-container>
</template>

<script>
import BlogCard from "../../components/BlogCard.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { BlogCard },
  props: {
    category: String,
  },
  data() {
    return {
      items: ["Date", "Category", "Writer", "View", "Like"],
    };
  },
  created() {
    this.fetchBlogByCategory(this.category);
  },
  methods: {
    ...mapActions(["fetchBlogByCategory"]),
    onFilter() {
      // await this.fetchBlogByCategory('culture')
    },
  },
  computed: {
    ...mapState(["copiedBlogList"]),
  },
};
</script>

<style scope>
/* .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot{
    width: 200px;
  } */
</style>
