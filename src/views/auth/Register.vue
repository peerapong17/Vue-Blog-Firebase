<template>
  <v-container fluid style="height: 100%">
    <v-row
      justify="center"
      style="height: 100% ; position: relative"
      align-content="center"
    >
      <v-col md="4" sm="8" class="d-flex justify-center">
        <v-card elevation="3" class="card pa-6 rounded-lg" width="100%">
          <v-form ref="form" lazy-validation>
            <v-text-field
              background-color="#fff2ff"
              prepend-inner-icon="mdi-account"
              label="Username"
              solo
              :rules="[
                (v) => !!v || 'Username is required',
                (v) =>
                  (v && v.length >= 3) ||
                  'Username should be at least 3 characters long',
                (v) =>
                  /[a-zA-Z]{3,}/g.test(v) ||
                  'Username should contain at least 3 letters',
                (v) =>
                  /^[a-zA-Z-\d]+$/.test(v) ||
                  'Username cannot contain special letters',
              ]"
              v-model="username"
            ></v-text-field>
            <v-text-field
              background-color="#fff2ff"
              prepend-inner-icon="mdi-email"
              label="Email"
              solo
              :rules="[
                (v) => !!v || 'Email is required',
                (v) =>
                  /^([a-z\.-\d]+)@([a-z-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/.test(
                    v
                  ) || 'E-mail must be valid',
              ]"
              v-model="email"
            ></v-text-field>
            <v-text-field
              type="password"
              background-color="#fff2ff"
              prepend-inner-icon="mdi-key"
              label="Password"
              :rules="[
                (v) => !!v || 'password is required',
                (v) =>
                  (v && v.length >= 6) || 'Name must be at least 6 characters',
                (v) =>
                  /[a-zA-Z]{3,}/g.test(v) ||
                  'Password should contain at least 3 letters',
              ]"
              solo
              v-model="password"
            ></v-text-field>
            <v-text-field
              type="password"
              background-color="#fff2ff"
              prepend-inner-icon="mdi-restart"
              label="Confirm-Password"
              solo
              :rules="[
                (v) => !!v || 'confirmPassword is required',
                password == confirmPassword || 'Password must match',
              ]"
              v-model="confirmPassword"
            ></v-text-field>
          </v-form>
          <router-link :to="{ name: 'Login' }" class="login"
            >Already have an account?</router-link
          >
          <v-btn
            @click="onSubmit"
            :loading="isLoading"
            :disabled="isLoading"
            large
            color="success lighten-2"
            style="width: 100%"
            ><h2>Register</h2></v-btn
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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
      success: "",
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        this.error = "";
        auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            auth.currentUser.updateProfile({ displayName: this.username });
            this.isLoading = false;
            this.success = "Create account success!";
          })
          .catch((err) => {
            this.isLoading = false;
            this.error = err.message;
          });
      }
    },
  },
};
</script>

<style scoped>
.login {
  float: right;
  margin-top: 10px;
  margin-bottom: 27px;
  text-decoration: none;
}
.login:hover {
  text-decoration: underline;
}
.card {
  max-width: 400px;
}
</style>
