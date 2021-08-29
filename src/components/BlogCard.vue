<template>
  <v-col md="4">
    <v-card class="mx-4">
      <v-card-title class="headline font-weight-medium">{{
        title.substring(0, 1).toUpperCase() + title.substring(1)
      }}</v-card-title>
      <v-img height="250" :src="image"></v-img>
      <v-card-text>{{ content.substring(0, 90) + "..." }}</v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-btn @click.prevent="onDetail" outlined color="black"
          >See more...</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn text icon @click="onAddLike"
          ><v-icon color="blue lighten-2" :disabled="!isLiked"
            >mdi-thumb-up</v-icon
          ></v-btn
        >
        <v-btn text icon
          ><v-icon color="red lighten-2" disabled>mdi-thumb-down</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: {
    title: String,
    content: String,
    image: String,
    id: String,
    like: Array,
  },
  data() {
    return {
      isLiked: false,
    };
  },
  mounted() {
    this.like.map((item) => {
      if (item === localStorage.getItem("id")) {
        this.isLiked = true;
      }
    });
  },
  methods: {
    ...mapActions(["addLike"]),
    onDetail() {
      this.$router.push(`/blog-detail/${this.id}`);
    },
    async onAddLike() {
      // this.like = data.blog.like;
      await this.addLike(this.id)
    },
  },
};
</script>

<style></style>
