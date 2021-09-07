<template>
  <v-container>
    <v-row justify="center">
      <v-col md="8" sm="8">
        <v-card elevation="2">
          <v-img class="mx-auto mt-4" :src="blog.imagePath" width="100%" />
          <v-card-title class="text-center headline font-weight-medium">{{
            blog.title
          }}</v-card-title>
          <v-card-text>{{ blog.content }}</v-card-text>
          <div class="d-flex justify-space-between align-center mx-4 my-2">
            <v-chip small color="primary">
              {{ blog.category }}
            </v-chip>
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
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
          @deleteComment="onDeleteComment()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Comment from "../components/Comment.vue";
import moment from "moment";
import { auth, db, arrayField, timeStamp } from "../firebase/configs";
export default {
  components: { Comment },
  data() {
    return {
      comment: "",
      isLiked: false,
      comments: [],
      blog: {},
      convertedCreatedAt: ''
    };
  },
  created() {
    db.collection("Blogs")
      .doc(this.$route.params.blog_id)
      .get()
      .then((doc) => {
        console.log(doc.data()["createdAt"]);
        this.blog = { ...doc.data(), id: doc.id };
        this.blog.likes.map((item) => {
          if (item === auth.currentUser.uid) {
            this.isLiked = true;
          }
        });
        this.convertedCreatedAt = moment(this.blog.createdAt.toDate()).fromNow();
      })
      .then(() => {
        const item = [];
        db.collection("Comments")
          .where("blogId", "==", this.blog.id)
          .get()
          .then((res) => {
            res.docs.map((re) => {
              item.push({ ...re.data(), id: re.id });
            });
          });
        this.comments = item;
      });
  },
  methods: {
    async onAddLike() {
      if (!this.isLiked) {
        await db
          .collection("Blogs")
          .doc(this.blog.id)
          .update({
            likes: arrayField.arrayUnion(auth.currentUser.uid),
          });
      } else {
        await db
          .collection("Blogs")
          .doc(this.blog.id)
          .update({
            likes: arrayField.arrayRemove(auth.currentUser.uid),
          });
      }
    },
    async onAddComment() {
      await db.collection("Comments").add({
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName ?? "Anonymous",
        blogId: this.blog.id,
        comment: this.comment,
        createdAt: timeStamp,
      });

      this.commen = "";
    },
    onDeleteComment() {},
  },
};
</script>

<style></style>
