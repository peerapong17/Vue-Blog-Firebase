<template>
  <v-container fluid style="height: 100%">
    <v-row
      justify="center"
      style="height: 100%; position: relative"
      align-content="center"
    >
      <v-col md="4" sm="8" class="d-flex justify-center">
        <v-card elevation="3" class="card pa-6 rounded-lg" width="100%">
          <v-form ref="form" lazy-validation>
            <span class="text-center d-block mb-6 display-1 font-weight-bold "
              >Reset Password</span
            >
            <v-text-field
              background-color="#d6ffeb"
              prepend-inner-icon="mdi-email"
              label="Your Email"
              solo
              hide-details
              v-model="email"
            ></v-text-field>
          </v-form>
          <router-link class="forgetPassword" :to="{ name: 'Login' }"
            >Login?</router-link
          >

          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            @click="onSubmit"
            large
            class="btn"
            color="#263352"
            style="width: 100%"
            ><h2>Send</h2></v-btn
          >
        </v-card>
        <v-alert
          border="left"
          style="position: absolute; bottom: 0;"
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
  </v-container>
</template>

<script>
import { auth } from "../../firebase/configs";
export default {
  data() {
    return {
      email: "",
      success: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.error = "";
      this.isLoading = true;
      auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.isLoading = false;
          this.error = "";
          this.success =
            "Password reset link was sent to your Email, Please check your Email";
          setTimeout(() => {
            this.$router.push({ name: "Login" });
          }, 10000);
        })
        .catch((err) => {
          this.isLoading = false;
          this.success = "";
          console.log(err);
          this.error = err.message;
        });
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 400px;
}
.forgetPassword {
  float: right;
  margin: 7px;
  margin-bottom: 27px;
  text-decoration: none;
  cursor: pointer;
}

.forgetPassword:hover {
  text-decoration: underline;
}

.btn {
  color: rgb(250, 250, 250);
}

.btn:hover {
  background-color: black;
}
</style>
