<template>
  <v-row justify="center" class="mt-8 mb-4">
    <v-col cols="9" md="6" sm="6" class="cols">
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
        <v-btn
          @click="onUpdate"
          :loading="isUpdateBtnLoading"
          :disabled="isUpdateBtnLoading"
          color="primary"
          class="mt-3"
          >Update</v-btn
        >
        <v-btn
          @click="onDelete"
          :loading="isDeleteBtnLoading"
          :disabled="isDeleteBtnLoading"
          color="red lighten-1"
          class="mt-3 ml-2 white--text"
          >Delete</v-btn
        >
        <v-btn @click="onCancel" outlined color="warning" class="mt-3 ml-2"
          >Cancel</v-btn
        >
      </v-row>
    </v-col>
    <v-alert
      border="left"
      style="position: absolute; bottom: 40px;"
      transition="slide-y-reverse-transition"
      dismissible
      text
      width="450"
      :value="error || success !== ''"
      :type="error ? 'error' : 'success'"
      >{{ error ? error : success }}</v-alert
    >
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import { db, storage, storageRef, auth } from "../../firebase/configs";
export default {
  data() {
    return {
      imageFile: "",
      blog: {},
      success: "",
      error: "",
      image: "",
      isUpdateBtnLoading: false,
      isDeleteBtnLoading: false,
      fileType: ["image/png", "image/jpeg"],
    };
  },
  created() {
    db.collection("Blogs")
      .doc(this.$route.params.blog_id)
      .get()
      .then((res) => {
        this.blog = { ...res.data(), id: res.id };
        this.image = this.blog.imageUrl;
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
      const files = event.target.files[0];

      if (this.fileType.indexOf(files.type) > -1) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.image = fileReader.result;
        });
        fileReader.readAsDataURL(files);
        this.imageFile = files;
      } else {
        this.error = "Please select an image file (jpeg or png)";
      }
    },
    async onUpdate() {
      if (
        this.imageFile != "" &&
        this.blog.title != "" &&
        this.blog.content != ""
      ) {
        this.isUpdateBtnLoading = true;
        const filePath = `images/${auth.currentUser.uid}/Image-${Date.now()}`;
        storageRef
          .ref(filePath)
          .put(this.imageFile)
          .then((data) => {
            data.ref.getDownloadURL().then((url) => {
              db.collection("Blogs")
                .doc(this.$route.params.blog_id)
                .update({
                  title: this.blog.title,
                  content: this.blog.content,
                  imageUrl: url,
                  filePath: filePath,
                })
                .then(() => {
                  storage
                    .ref(this.blog.filePath)
                    .delete()
                    .then(() => {
                      this.isUpdateBtnLoading = false;
                      this.success = "Blog updated successfully";
                      setTimeout(() => {
                        this.$router.push({ name: "User-Blog" });
                      }, 3000);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  this.error = err.message;
                });
            });
          });
      } else {
        this.isUpdateBtnLoading = true;
        db.collection("Blogs")
          .doc(this.$route.params.blog_id)
          .update({
            title: this.blog.title,
            content: this.blog.content,
          })
          .then(() => {
            this.isUpdateBtnLoading = false;
            this.success = "Blog updated successfully";
            setTimeout(() => {
              this.$router.push({ name: "User-Blog" });
            }, 3000);
          })
          .catch((err) => {
            this.isUpdateBtnLoading = false;
            this.error = err.message;
          });
      }
    },
    async onDelete() {
      this.isDeleteBtnLoading = true;
      db.collection("Blogs")
        .doc(this.$route.params.blog_id)
        .delete()
        .then(() => {
          storage
            .refFromURL(this.blog.imageUrl)
            .delete()
            .then(() => {
              this.isDeleteBtnLoading = false;
              this.success = "Blog updated successfully";
              setTimeout(() => {
                this.$router.push({ name: "User-Blog" });
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          this.isDeleteBtnLoading = false;
          this.error = err.message;
        });
    },
  },
};
</script>

<style scoped>
.cols {
  position: relative;
}
</style>
