<script lang="ts">
import { ref, defineComponent, computed, toRefs, watch } from "vue";
import { Encoder } from "@nuintun/qrcode";

export default defineComponent({
  name: "Qr",
  props: {
    modelValue: String
  },
  setup(_props, ctx) {
    const el = ref<HTMLElement>();
    const props = toRefs(_props);
    const url = ref("");

    const model = computed({
      get() {
        return props.modelValue.value;
      },
      set(value?: string) {
        ctx.emit("update:modelValue", value);
      }
    });

    const makeCode = (value?: string) => {
      if (!value) return (url.value = "");
      const qr = new Encoder();
      qr.write(value);
      qr.make();
      console.log(qr);
      url.value = qr.toDataURL(10, 20);
    };

    watch(
      () => props.modelValue.value,
      val => makeCode(val),
      {
        immediate: true
      }
    );

    return {
      el,
      model,
      url,
      fs: ref(false)
    };
  }
});
</script>

<template>
  <div class="qr">
    <input type="text" v-model="model" hidden />
    <img :src="url" v-if="url" width="500" @click="fs = true" />
  </div>

  <div class="fs-qr" v-if="fs && url" @click="fs = false">
    <img :src="url" v-if="url" width="500" />
  </div>
</template>

<style scoped>
img {
  width: 100%;
  display: block;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.qr img {
  cursor: pointer;
}

.fs-qr {
  position: fixed;
  cursor: pointer;
  top: 0;
  left: 0;
  z-index: 99;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.fs-qr img {
  width: 95vw;
  height: 80vh;
  display: block;
  object-fit: contain;
}
</style>
