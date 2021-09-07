<template>
  <v-card class="mb-6 px-2">
    <v-row justify="center" align="center" class="flex-nowrap px-4 py-2">
      <v-avatar color="accent" class="mr-3" size="48"></v-avatar>
      <div class="comment-box">
        <span class="username">{{ comment.username }}</span>
        <span class="comment" v-if="!isEditting">{{ text }}</span>
        <v-text-field
          background-color="#fafafa"
          flat
          hide-details
          v-else
          solo
          v-model="text"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <div v-if="isMyComment">
        <v-btn
          @click="isEditting = !isEditting"
          v-if="!isEditting"
          small
          class="mr-2"
          color="primary"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn
          @click="onUpdateComment"
          v-else
          small
          class="mr-2"
          color="success"
          ><v-icon>mdi-check</v-icon></v-btn
        >

        <v-btn @click="deleteComment" v-if="!isEditting" small dark color="red"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
        <v-btn v-else @click="onCancel" small dark color="red"
          ><v-icon>mdi-cancel</v-icon></v-btn
        >
      </div>
    </v-row>
    <v-row class="px-4 pb-2">
      <v-spacer></v-spacer>
      <span :style="{ color: '#adadad', fontSize: '15px' }">{{
        convertedCreatedAt
      }}</span>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";
import { auth, db } from "../firebase/configs";
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      text: "",
      isMyComment: false,
      isEditting: false,
      convertedCreatedAt: ""
    };
  },
  created() {
    this.convertedCreatedAt = moment(this.comment.createdAt.toDate()).fromNow();
    if (this.comment.userId === auth.currentUser.uid) {
      this.isMyComment = true;
    }
    this.text = this.comment.comment;

  },
  methods: {
    onUpdateComment() {
      this.isEditting = !this.isEditting;
      db.collection("Comments")
        .doc(this.comment.id)
        .update({
          comment: this.text,
        })
        .then(() => {
          console.log("comment updated");
        });
    },
    deleteComment() {
      console.log("object");
      db.collection("Comments")
        .doc(this.comment.id)
        .delete()
        .then(() => {
          console.log("comment deleted");
        });
    },

    onCancel() {
      this.isEditting = !this.isEditting;
      this.text = this.comment.comment;
    },
  },
};
</script>

<style scoped>
.comment-box {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.username {
  color: #6e6e6e;
  font-size: 17px;
}

.comment {
  font-size: 20px;
}
</style>
