<template>
  <v-row justify="center" class="mt-8 mb-4">
    <v-col cols="9" md="6" sm="6">
      <v-form ref="form">
        <img
          v-if="image"
          :src="image"
          alt="imageForBlog"
          width="100%"
          class="mb-4"
          height="480"
        />
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="onFilePicked"
        />
        <v-btn
          large
          outlined
          class="mb-5"
          color="primary"
          @click="onPickFile"
          block
          ><v-icon>mdi-upload</v-icon></v-btn
        >
        <v-Text-field
          :rules="[(v) => !!v || 'Title is required']"
          v-model="blog.title"
          filled
          label="Title"
          required
        />
        <v-textarea
          :rules="[(v) => !!v || 'Content is required']"
          v-model="blog.content"
          filled
          label="Content"
          required
        />
      </v-form>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn @click="onUpdate" color="primary" class="mt-3">Update</v-btn>
        <v-btn
          @click="onDelete"
          color="red lighten-1"
          class="mt-3 ml-2 white--text"
          >Delete</v-btn
        >
        <v-btn @click="onCancel" outlined color="warning" class="mt-3 ml-2"
          >Cancel</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import { db, storage, storageRef } from "../firebase/configs";
export default {
  data() {
    return {
      imageFile: "",
      image: "",
      blog: {},
    };
  },
  created() {
    db.collection("Blogs")
      .doc(this.$route.params.blog_id)
      .get()
      .then((res) => {
        this.blog = res.data();
        this.image = this.blog.imagePath
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    ...mapActions(["fetchSpicificData", "updateBlog", "deleteBlog"]),
    onPickFile() {
      this.$refs.file.click();
    },
    onCancel() {
      this.$router.push("/user-blog");
    },
    onFilePicked(event) {
      const files = event.target.files;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.image = fileReader.result;
      });

      fileReader.readAsDataURL(files[0]);
      this.imageFile = files[0];
    },
    async onUpdate() {
      if (
        this.imageFile != "" &&
        this.blog.title != "" &&
        this.blog.content != ""
      ) {
        storageRef
          .child("Image-" + Date.now())
          .put(this.imageFile)
          .then((data) => {
            data.ref.getDownloadURL().then((url) => {
              db.collection("Blogs")
                .doc(this.$route.params.blog_id)
                .update({
                  title: this.blog.title,
                  content: this.blog.content,
                  imagePath: url,
                })
                .then(() => {
                  storage
                    .refFromURL(this.blog.imagePath)
                    .delete()
                    .then(() => {
                      this.$router.push("/user-blog");
                    });
                });
            });
          });
      } else {
        db.collection("Blogs")
          .doc(this.$route.params.blog_id)
          .update({
            title: this.blog.title,
            content: this.blog.content,
          })
          .then(() => {
            this.$router.push("/user-blog");
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    },
    async onDelete() {
      db.collection("Blogs")
        .doc(this.$route.params.blog_id)
        .delete()
        .then(() => {
          this.$router.push("/user-blog");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
