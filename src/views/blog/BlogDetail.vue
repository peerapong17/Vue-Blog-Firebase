<template>
  <v-container>
    <v-row justify="center">
      <v-progress-circular
        v-if="isLoading"
        :size="50"
        color="black"
        indeterminate
        class="spinner"
      ></v-progress-circular>
      <v-col md="8" sm="8" v-else>
        <v-card elevation="2">
          <v-img class="mx-auto mt-4" :src="blog.imageUrl" width="100%" />
          <v-card-title class="text-center headline font-weight-medium">{{
            blog.title
          }}</v-card-title>
          <v-card-text>{{ blog.content }}</v-card-text>
          <div class="d-flex justify-space-between align-center mx-4 my-2">
            <router-link
              :to="{
                name: 'GetBlogByCategory',
                params: { category: blog.category },
              }"
              class="category"
            >
              <v-chip small dark color="blue">
                {{ blog.category }}
              </v-chip></router-link
            >
            <span>{{ convertedCreatedAt }}</span>
          </div>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
            <v-rating icon-label="custom icon label text {0} of {1}"></v-rating>
            <v-spacer></v-spacer>
            <v-btn @click="onAddLike" icon text
              ><v-icon color="blue lighten-2" :disabled="!isLiked"
                >mdi-thumb-up</v-icon
              ></v-btn
            >
            <v-btn icon text
              ><v-icon color="red lighten-2" :disabled="true"
                >mdi-thumb-down</v-icon
              ></v-btn
            >
          </v-card-actions>
        </v-card>
        <v-text-field
          v-model="comment"
          label="Comment"
          name="comment"
          class="mt-10"
          filled
        ></v-text-field>
        <v-row justify="end" class="px-3">
          <v-btn @click="onAddComment" class="mb-10" color="primary"
            >Add comment</v-btn
          >
        </v-row>
        <Comment
          v-for="(comment, index) in blog.comments"
          :key="index"
          :comment="comment"
          @onDeleteComment="onDeleteComment($event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Comment from "../../components/Comment.vue";
import { auth, db, arrayField, timeStamp } from "../../firebase/configs";
export default {
  components: { Comment },
  data() {
    return {
      comment: "",
      blog: {},
      comments: [],
      isLoading: true,
      unsubBlogDetail: null,
    };
  },
  created() {
    this.unsubBlogDetail = db
      .collection("Blogs")
      .doc(this.$route.params.blog_id)
      .onSnapshot((snapshot) => {
        console.log(snapshot.data()["content"]);
        console.log(snapshot.id);
        this.blog = { ...snapshot.data(), id: snapshot.id };
        this.isLoading = false;
      });
  },
  destroyed() {
    this.unsubBlogDetail();
  },
  methods: {
    async onAddLike() {
      if (!this.isLiked) {
        await db
          .collection("Blogs")
          .doc(this.blog.id)
          .update({
            likes: arrayField.arrayUnion(auth.currentUser.uid),
          })
          .then(() => {
            this.blog.likes.push(auth.currentUser.uid);
          });
      } else {
        await db
          .collection("Blogs")
          .doc(this.blog.id)
          .update({
            likes: arrayField.arrayRemove(auth.currentUser.uid),
          })
          .then(() => {
            this.blog.likes = this.blog.likes.filter((like) => {
              return like !== auth.currentUser.uid;
            });
          });
      }
    },
    async onAddComment() {
      await db
        .collection("Blogs")
        .doc(this.blog.id)
        .update({
          comments: [
            ...this.blog.comments,
            {
              id: uuidv4(),
              userId: auth.currentUser.uid,
              username: auth.currentUser.displayName ?? "Anonymous",
              comment: this.comment,
              createdAt: timeStamp,
            },
          ],
        });
      this.comment = "";
    },
    onDeleteComment(commentId) {
      this.blog.comments = this.blog.comments.filter((comment) => {
        return comment.id != commentId;
      });

      db.collection("Blogs")
        .doc(this.blog.id)
        .update({
          comments: this.blog.comments,
        });
    },
  },
  computed: {
    isLiked() {
      if (this.blog.likes.includes(auth.currentUser.uid)) {
        return true;
      } else {
        return false;
      }
    },
    convertedCreatedAt() {
      return moment(this.blog.createdAt.toDate()).fromNow();
    },
  },
};
</script>

<style scoped>
.spinner {
  margin-top: 200px;
}
.category {
  text-decoration: none;
}
</style>
