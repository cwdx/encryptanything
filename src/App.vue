<template>
  <div id="nav">
    <router-link to="/">EncryptAnything</router-link> |
    <router-link to="/tools">Tools</router-link> |
    <router-link to="/about">About</router-link>
  </div>

  <router-view />

  <footer>
    <small
      >{{ footer }} is a beta release.<br />
      The author takes no responsibility for loss of data.</small
    >
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import pkg from "../package.json";

export default defineComponent({
  setup() {
    const footer = pkg.name + " v" + pkg.version;
    return {
      footer
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
