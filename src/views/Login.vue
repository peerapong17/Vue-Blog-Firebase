<template>
  <v-container fluid style="height: 100%">
    <v-row
      justify="center"
      style="height: 100%; position: relative"
      align-content="center"
    >
      <v-col md="4" sm="8" class="d-flex justify-center">
        <v-card elevation="3" class="pa-6 rounded-lg" width="100%">
          <v-form ref="form" lazy-validation>
            <span class="text-center d-block mb-6 display-1 font-weight-bold "
              >Login</span
            >
            <v-text-field
              background-color="#e6fffa"
              prepend-inner-icon="mdi-email"
              label="Email"
              solo
              v-model="email"
            ></v-text-field>
            <v-text-field
              background-color="#e6fffa"
              prepend-inner-icon="mdi-key"
              label="Password"
              solo
              v-model="password"
              type="password"
            ></v-text-field>
          </v-form>
          <router-link :to="{ name: 'Register' }" class="text-end d-block mb-4"
            >Don't have an account?</router-link
          >

          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            @click="onSubmit"
            large
            color="#f9ccff"
            style="width: 100%"
            ><h2>Register</h2></v-btn
          >
          <v-btn
            large
            color="white"
            elevation="1"
            class="mt-2"
            style="width: 100%"
            @click="onGoogleSignin"
            ><img
              :src="require('@/assets/images/google.jpg')"
              alt="google"
              width="30"
            />
            <h2 class="ml-3">Login with Google</h2></v-btn
          >
        </v-card>
        <v-alert
          dismissible
          width="450"
          style="position: absolute; bottom: 0;"
          transition="slide-y-reverse-transition"
          border="left"
          text
          absolute
          type="error"
          :value="error !== ''"
          >{{ error }}</v-alert
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, googleProvider } from "../firebase/configs";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      this.error = "";
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          if (userCredential) {
            this.isLoading = false;
            this.$router.push("/home");
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.error = err.message;
        });
    },
    onGoogleSignin() {
      auth.signInWithPopup(googleProvider).then(() => {
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style>
.text-end {
  text-decoration: none;
}
.text-end:hover {
  text-decoration: underline;
}
</style>
