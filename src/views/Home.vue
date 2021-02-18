<template>
  <div class="home">
    <button
      type="button"
      @click="
        form.mode = 0;
        reset();
      "
    >
      Encrypt
    </button>
    <button
      type="button"
      @click="
        form.mode = 1;
        reset();
      "
    >
      Decrypt
    </button>

    <form @submit.prevent="encryptValue" class="encrypt" v-if="form.mode === 0">
      <input v-model="form.key" type="text" placeholder="key" />
      <textarea v-model="form.value" placeholder="value" />
      <textarea readonly v-if="form.output" v-model="form.output" />
      <button>encrypt</button>
      <button type="button" @click.prevent="generateKeyValue">
        generate key
      </button>
    </form>

    <form @submit.prevent="decryptValue" class="decrypt" v-if="form.mode === 1">
      <input v-model="form.key" type="text" placeholder="key" />
      <textarea v-model="form.value" placeholder="value" />
      <textarea readonly v-if="form.output" v-model="form.output" />
      <button>decrypt</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useCrypto } from "@/lib/crypto";

export default defineComponent({
  name: "Home",
  setup() {
    const form = reactive({
      mode: 0 as 0 | 1,
      key: "",
      value: "",
      generatedKey: "",
      output: "",
    });

    const { encrypt, decrypt, generateKey } = useCrypto();

    const encryptValue = () => {
      if (form.key.length !== 32) {
        return alert("Please provide a 32 character long key");
      }
      try {
        const value = encrypt(form.value, form.key);
        form.output = value;
      } catch (e) {
        alert("Could not encrypt data");
        console.warn(e.message);
      }
    };

    const decryptValue = () => {
      if (form.key.length !== 32) {
        return alert("Please provide a 32 character long key");
      }
      try {
        const value = decrypt(form.value, form.key);
        form.output = value;
        console.log(value);
      } catch (e) {
        alert("Could not decrypt data");
        console.warn(e.message);
      }
    };

    const generateKeyValue = () => {
      form.key = generateKey();
    };

    const reset = () => {
      form.value = "";
      form.key = "";
      form.generatedKey = "";
      form.output = "";
    };

    return {
      encryptValue,
      decryptValue,
      generateKeyValue,
      form,
      reset,
    };
  },
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home {
  padding: 1rem;
  text-align: left;
  max-width: 500px;
  margin: auto;
}

textarea {
  resize: vertical;
}

button,
input,
textarea,
select {
  margin-bottom: 0.75rem;
  font: inherit;
}

input,
textarea,
select {
  display: block;
  width: 100%;
}

input,
textarea {
  font-family: monospace;
}

button {
  margin-right: 0.25rem;
}

[readonly] {
  opacity: 0.7;
}
</style>
