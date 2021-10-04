<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ id }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="{ name: item.link }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Todo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
      class="shrink"
      hide-details
      single-line
      v-model="searchInput"
      solo
      placeholder="Search..."
      append-icon="mdi-magnify"
      @click:append="onSearch"
    ></v-text-field>
      <v-btn
        @click="dialog = true"
        large
        color="red lighten-1"
        class="white--text ml-3"
        >Logout<v-icon right>mdi-logout</v-icon></v-btn
      >
    </v-app-bar>

    <v-main>
      <slot></slot>
    </v-main>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure?
        </v-card-title>

        <v-card-text>
          You will be directed to the home page.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text color="primary" @click="dialog = false">
            cancel
          </v-btn>

          <v-btn color="red lighten-1" class="white--text" @click="onLogout">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { auth } from "../firebase/configs";
export default {
  name: "App",

  data: () => {
    return {
      id: "",
      username: "",
      dialog: false,
      drawer: false,
      searchInput: ""
    };
  },
  methods: {
    ...mapMutations(["getBlogBySearchInput"]),
    onLogout() {
      auth
        .signOut()
        .then(() => {
          this.dialog = false;
          this.$router.push({name: "Login"});
        })
        .catch(() => {
          this.dialog = false;
        });
    },
    onSearch(){
      this.getBlogBySearchInput(this.searchInput)
    }
  },
  computed: {
    ...mapState(["items"]),
  },
};
</script>
