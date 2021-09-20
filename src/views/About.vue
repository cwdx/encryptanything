<template>
  <div class="about">
    <p>
      {{ title }}. This is a product by
      <a href="https://comwidedigital.com">cwdx</a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import pkg from "../../package.json";

export default defineComponent({
  setup() {
    const title = pkg.name + " v" + pkg.version;
    return {
      title
    };
  }
});
</script>
