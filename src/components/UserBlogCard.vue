<template>
  <v-col md="4">
    <v-card class="mx-4">
      <v-card-title class="headline font-weight-medium">{{
        title.substring(0, 1).toUpperCase() + title.substring(1)
      }}</v-card-title>
      <v-img height="250" :src="imageUrl"></v-img>
      <v-card-text>{{ content.substring(0, 30) + "..." }}</v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-btn @click.prevent="onDetail" outlined color="warning">Edit</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="onAddLike" text icon
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
import { auth, db, arrayField } from "../firebase/configs";
export default {
  props: {
    title: String,
    content: String,
    imageUrl: String,
    id: String,
    likes: Array,
  },
  data() {
    return {
      isLiked: false,
    };
  },
  created() {
    this.likes.map((item) => {
      if (item === auth.currentUser.uid) {
        this.isLiked = true;
      }
    });
  },
  methods: {
    onDetail() {
      this.$router.push(`/edit-blog/${this.id}`);
    },
    async onAddLike() {
      if (!this.isLiked) {
        db.collection("Blogs")
          .doc(this.id)
          .update({
            likes: arrayField.arrayUnion(auth.currentUser.uid),
          })
          .then(() => {
            this.isLiked = !this.isLiked;
          });
      } else {
        db.collection("Blogs")
          .doc(this.id)
          .update({
            likes: arrayField.arrayRemove(auth.currentUser.uid),
          })
          .then(() => {
            this.isLiked = !this.isLiked;
          });
      }
    },
  },
};
</script>

<style></style>
