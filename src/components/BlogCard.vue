<template>
  <v-col md="4">
    <v-card class="mx-4">
      <v-card-title class="headline font-weight-medium">{{
        title.substring(0, 1).toUpperCase() + title.substring(1)
      }}</v-card-title>
      <v-img height="250" :src="imageUrl"></v-img>
      <v-card-text>{{ content.substring(0, 90) + "..." }}</v-card-text>
      <div class="d-flex justify-space-between align-center mx-3 my-2">
        <v-chip small color="primary">
          {{ category }}
        </v-chip>
        <span>{{ convertedCreatedAt }}</span>
      </div>
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
import moment from "moment";
import { db, auth, arrayField } from "../firebase/configs";
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      required: true,
    },
    createdAt: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
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
      this.$router.push(`/blog-detail/${this.id}`);
    },
    async onAddLike() {
      if (!this.isLiked) {
        await db
          .collection("Blogs")
          .doc(this.id)
          .update({
            likes: arrayField.arrayUnion(auth.currentUser.uid),
          })
          .then(() => {
            this.isLiked = !this.isLiked;
          });
      } else {
        await db
          .collection("Blogs")
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
  computed: {
    convertedCreatedAt() {
      return moment(this.createdAt.toDate()).fromNow();
    },
  },
};
</script>

<style></style>
