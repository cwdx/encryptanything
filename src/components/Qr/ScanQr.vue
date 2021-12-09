<script lang="ts">
import { defineComponent, ref } from "vue";
import { Decoder } from "@nuintun/qrcode";
import pica from "pica";

export default defineComponent({
  name: "ScanQr",
  props: {
    modelValue: String
  },
  emits: ["capture", "error"],
  setup(_, { emit }) {
    const el = ref<HTMLInputElement>();
    const el2 = ref<HTMLInputElement>();
    const canvas = ref<HTMLCanvasElement>();
    const src = ref("");
    const handleError = error => {
      console.error("qr:error", error);
      emit("error", error);
    };
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    const resizeImage = async (url: string): Promise<string> => {
      const img = new Image();
      const treshhold = 600;
      img.src = url;
      return new Promise(res => {
        img.onload = () => {
          if (img.naturalHeight > treshhold) {
            const ratio = img.width / img.height;
            img.height = treshhold;
            img.width = treshhold * ratio;
          } else if (img.naturalWidth > treshhold) {
            const ratio = img.height / img.width;
            img.width = treshhold;
            img.height = treshhold * ratio;
          }

          const cv = document.createElement("canvas");
          const ctx = cv.getContext("2d");
          if (ctx) ctx.drawImage(cv, 0, 0, img.width, img.height);

          cv.width = img.width;
          cv.height = img.height;

          pica()
            .resize(img, cv, {
              unsharpAmount: 80,
              unsharpRadius: 0.6,
              unsharpThreshold: 2
            })
            .then(canvas => res(canvas.toDataURL() as string))
            .catch(handleError);
        };
      });
    };

    const capture = async (e: InputEvent) => {
      if (!e.target) return;
      const file = ((e.target as HTMLInputElement).files || [])[0];
      const qr = new Decoder();
      const _url = await toBase64(file);
      const url = await resizeImage(_url);
      src.value = url;

      setTimeout(() => (src.value = ""), 800);

      qr.setOptions({
        canOverwriteImage: true,
        inversionAttempts: "attemptBoth"
      });

      qr.scan(url)
        .then(({ data }) => {
          console.log("qr:capture", data);
          emit("capture", data);
        })
        .catch(handleError);
    };

    return {
      capture,
      el,
      el2,
      canvas,
      src
    };
  }
});
</script>

<template>
  <button
    @click="el.click()"
    style="margin-bottom: .75rem; margin-right: .25rem;"
    type="button"
  >
    Scan QR
  </button>

  <button @click="el2.click()" style="margin-bottom: .75rem" type="button">
    Select QR
  </button>

  <canvas ref="canvas" hidden />

  <img
    :src="src"
    v-if="src"
    style="position: fixed; top: 50%; left: 50%; z-index: 100; transform: translate(-50%, -50%); border: 2rem solid white"
  />

  <input
    hidden
    type="file"
    accept="image/*"
    capture
    @change="capture"
    ref="el"
  />
  <input hidden type="file" accept="image/*" @change="capture" ref="el2" />
</template>
