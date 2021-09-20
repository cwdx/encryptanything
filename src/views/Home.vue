<template>
  <div class="home">
    <pre v-if="form.debug">{{ form }}</pre>
    <nav>
      <a
        href="#encrypt"
        :class="{ active: form.mode === 0 }"
        @click.prevent="
          form.mode = 0;
          reset();
        "
        v-text="'Encrypt'"
      />
      |
      <a
        :class="{ active: form.mode === 1 }"
        href="#decrypt"
        @click.prevent="
          form.mode = 1;
          reset();
        "
        v-text="'Decrypt'"
      />
    </nav>

    <form @submit.prevent="encryptValue" class="encrypt" v-if="form.mode === 0">
      <div>
        <input type="checkbox" v-model="form.iv" placeholder="IV" id="iv" />
        <label for="iv">Use Initialization Vector</label>
      </div>
      <div>
        <select v-model="form.algo" id="algo">
          <option value="" disabled>- Select Algorithm -</option>
          <option v-for="(algo, i) of algos" :key="i">{{ algo }}</option>
        </select>
        <label for="algo" hidden>Algorithm</label>
      </div>

      <div>
        <input v-model="form.key" type="text" placeholder="key" />
        <small>
          <a href="#generate-key" @click.prevent="generateKeyValue">
            generate
          </a>
        </small>
      </div>

      <textarea v-model="form.value" placeholder="value" />
      <textarea readonly v-if="form.output" v-model="form.output" />
      <button type="submit">submit</button>
    </form>

    <form @submit.prevent="decryptValue" class="decrypt" v-if="form.mode === 1">
      <textarea v-model="form.value" placeholder="value" />
      <input v-model="form.key" type="text" placeholder="key" />
      <textarea readonly v-if="form.output" v-model="form.output" />
      <button type="submit">decrypt</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useCrypto } from "@/lib/crypto";

export default defineComponent({
  name: "Home",
  setup() {
    const { generateKey, cryptr, defaultAlgo, algos } = useCrypto();

    const form = reactive({
      mode: 0 as 0 | 1,
      iv: false,
      key: "",
      value: "",
      generatedKey: "",
      output: "",
      debug: false,
      algo: defaultAlgo
    });

    const encryptValue = () => {
      const iv = !!form.iv;

      if (iv && form.key.length !== 32) {
        return alert("Please enter a 32 character long key");
      } else if (!form.value.trim()) {
        return alert("Please enter a value");
      }
      try {
        const value = iv
          ? cryptr.encryptIv(form.value, form.key, form.algo)
          : cryptr.encrypt(form.value, form.key, form.algo);
        form.output = value;
      } catch (e) {
        alert("Could not encrypt data");
        console.warn(e.message);
      }
    };

    const decryptValue = () => {
      const iv = !!form.iv;
      if (iv && form.key.length !== 32) {
        return alert("Please enter a 32 character long key");
      } else if (!form.value.trim()) {
        return alert("Please enter a value");
      } else if (!form.key.trim()) {
        return alert("Please enter a key");
      }
      try {
        const value = cryptr.decrypt(form.value, form.key);
        form.output = value;
        console.log(value);
      } catch (e) {
        alert("Could not decrypt data");
        console.warn(e.message);
        console.warn(e);
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
      algos
    };
  }
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

a {
  color: #2c3e50;
}

.active {
  color: #42b983;
}

form {
  margin-top: 1rem;
}

textarea {
  resize: vertical;
}

button,
form > div,
form > input[type="text"],
form > textarea,
select {
  margin-bottom: 0.75rem;
  font: inherit;
}

button,
nav a {
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  display: block;
  width: 100%;
}

input[type="text"],
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
