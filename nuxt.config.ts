import tailwindcss from "@tailwindcss/vite";
import "./app/lib/env";
import env from "./app/lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-csurf',
    'nuxt-maplibre'
  ],
  // eslint: {
  //   config: {
  //     standalone: false
  //   }
  // },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['maplibre-gl']
    },
    server: {
      watch: {
        ignored: ['./docker-data/*']
      }
    }
  },
  runtimeConfig: {
    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY,
      s3BucketUrl: env.S3_BUCKET_URL,
    },

  },
  colorMode: {
    dataValue: 'theme',
  }
})