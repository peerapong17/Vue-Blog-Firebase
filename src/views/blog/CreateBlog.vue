<template>
  <v-row justify="center" class="mt-8 fill-height">
    <v-col cols="9" md="6" sm="6" class="cols">
      <v-form ref="form" class="formGroup">
        <img
          v-if="imageUrl"
          :src="imageUrl"
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
          :rules="[
          (v) => !!v || 'Title is required',
          (v) => (v && v.length >= 6) || 'Title should be at least 6 characters long'
          ]"
          v-model="title"
          filled
          label="Title"
          required
        />
        <v-textarea
          :rules="[(v) => !!v || 'Content is required',
            (v) => (v && v.length >= 30) || 'Title should be at least 30 characters long'
          ]"
          v-model="content"
          filled
          label="Content"
          required
          counter="30"
          clearable
        />
        <v-select
          :items="categories"
          filled
          label="Category"
          v-model="category"
          :rules="[(v) => !!v || 'Category is required']"
        ></v-select>
        <div class="btnContainer">
          <v-btn
            @click="onCreateBlog"
            :loading="isLoading"
            :disabled="isLoading"
            color="success"
            class="mr-2"
            >Create</v-btn
          >
          <v-btn @click="onCancel" outlined color="red">Cancel</v-btn>
        </div>
      </v-form>
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
    </v-col>
  </v-row>
</template>

<script>
import { auth, db, timeStamp, storageRef } from "../../firebase/configs";
export default {
  data() {
    return {
      title: "",
      content: "",
      imageUrl: "",
      imageFile: "",
      category: "",
      success: "",
      error: "",
      isLoading: false,
      fileType: ["image/png", "image/jpeg"],
      categories: ["Travel", "Food", "Culture", "Tradition"],
    };
  },
  methods: {
    async onCreateBlog() {
      if (this.$refs.form.validate() && this.imageFile) {
        this.isLoading = true;
        const filePath = `images/${auth.currentUser.uid}/Image-${Date.now()}`;
        storageRef
          .ref(filePath)
          .put(this.imageFile)
          .then((data) => {
            data.ref.getDownloadURL().then((url) => {
              db.collection("Blogs")
                .add({
                  userId: auth.currentUser.uid,
                  title: this.title,
                  content: this.content,
                  category: this.category,
                  imageUrl: url,
                  filePath: filePath,
                  likes: [],
                  comments: [],
                  createdAt: timeStamp,
                })
                .then(() => {
                  this.isLoading = false;
                  this.$refs.form.reset();
                  this.imageUrl = "";
                  this.success = "Create Blog Sucess";
                  setTimeout(() => {
                    this.$router.push({ name: "Home" });
                  }, 3000);
                });
            });
          })
          .catch((err) => {
            this.error = err.message;
          });
      } else {
        this.error = "Please select an image file (jpeg or png)";
      }
    },
    onPickFile() {
      this.$refs.file.click();
    },
    onFilePicked(event) {
      const files = event.target.files[0];
      if (this.fileType.indexOf(files.type) > -1) {
        this.error = "";
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;
        });
        fileReader.readAsDataURL(files);
        this.imageFile = files;
      } else {
        this.error = "Please select an image file (jpeg or png)";
      }
    },
    onCancel() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style scoped>
.formGroup {
  width: 100%;
}
.cols {
  position: relative;
  display: flex;
  justify-content: center;
}

.btnContainer {
  display: flex;
  justify-content: flex-end;
}
</style>
