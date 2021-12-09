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
      |
      <a
        :class="{ active: form.mode === 2 }"
        href="#words"
        @click.prevent="
          form.mode = 2;
          reset();
        "
        v-text="'Encrypt Words'"
      />
      |
      <a
        :class="{ active: form.mode === 3 }"
        href="#words"
        @click.prevent="
          form.mode = 3;
          reset();
        "
        v-text="'Decrypt Words'"
      />
    </nav>

    <form @submit.prevent="encryptValue" class="encrypt" v-if="form.mode === 0">
      <ScanQr @capture="form.value = $event" @error="error($event)" />

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
      <Qr v-model="form.output" />

      <button type="submit">encrypt</button>
    </form>

    <form class="decrypt" v-if="form.mode === 1" @submit.prevent="decryptValue">
      <ScanQr @capture="form.value = $event" @error="error($event)" />

      <textarea v-model="form.value" placeholder="value" />
      <input v-model="form.key" type="text" placeholder="key" />
      <textarea readonly v-if="form.output" v-model="form.output" />
      <button type="submit">decrypt</button>
    </form>

    <form class="decrypt" v-if="form.mode === 2">
      <ScanQr @capture="form.words = $event" @error="error($event)" />

      <textarea v-model="form.words" placeholder="words" />

      <input type="number" v-model.number="form.offset" placeholder="offset" />
      <textarea
        readonly
        v-if="encryptedWords"
        :value="encryptedWords"
        placeholder="words"
      />
      <Qr v-model="encryptedWords" />
    </form>

    <form class="decrypt" v-if="form.mode === 3">
      <ScanQr @capture="form.words = $event" @error="error($event)" />

      <textarea v-model="form.words" placeholder="codes" />

      <input type="number" v-model.number="form.offset" placeholder="offset" />
      <textarea
        readonly
        v-if="decryptedWords"
        :value="decryptedWords"
        placeholder="words"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { useCrypto } from "@/lib/crypto";
import Qr from "@/components/Qr/Qr.vue";
import ScanQr from "@/components/Qr/ScanQr.vue";
import wordlist from "@/assets/wordlist";

export default defineComponent({
  name: "Home",
  components: {
    Qr,
    ScanQr
  },
  setup() {
    const { generateKey, cryptr, defaultAlgo, algos } = useCrypto();
    const url = ref("");
    const form = reactive({
      mode: 0 as 0 | 1 | 2 | 3,
      iv: false,
      key: "",
      value: "",
      generatedKey: "",
      output: "",
      debug: false,
      algo: defaultAlgo,
      offset: 0,
      words: ""
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
      form.words = "";
    };

    const encryptedWords = computed(() => {
      const words = form.words
        .trim()
        .split(/\s+/)
        .filter(w => !!w)
        .map(w => wordlist.indexOf(w.trim()));
      if (words.includes(-1)) return "";
      return words.map(w => w + form.offset).join(" ");
    });

    const decryptedWords = computed(() => {
      const words = form.words
        .trim()
        .split(/\s+/)
        .filter(w => w !== "")
        .map(v => +v - form.offset)
        .map(n => wordlist[n])
        .join(" ");

      return words;
    });

    return {
      encryptValue,
      decryptValue,
      generateKeyValue,
      form,
      reset,
      algos,
      url,
      error: (str: string) => alert(str),
      encryptedWords,
      decryptedWords
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
form > input[type="number"],
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
input[type="number"],
textarea,
select {
  display: block;
  width: 100%;
}

input[type="text"],
input[type="number"],
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
