import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },
  devServer: {
    port: 8000
  },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  ssr: false,
  dev: process.env.NODE_ENV !== 'production',
  runtimeConfig: {
    // private buildtime available variables
    SOME_PRIVATE_VAR: 'server-side only',
    // public runtime available variables
    public: {
      // api
      BASE_API_URL: process.env.BASE_API_URL,
      CENTER_RAMBOUILLET_ID: process.env.CENTER_RAMBOUILLET_ID,
      // firebase
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      // stripe
      STRIPE_ALIXONE_ACCESS_KEY: process.env.STRIPE_ALIXONE_ACCESS_KEY,
      STRIPE_FERDIONE_ACCESS_KEY: process.env.STRIPE_FERDIONE_ACCESS_KEY,
      // mapbox
      MAPBOX_MAP_STYLE: process.env.MAPBOX_MAP_STYLE,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,

      // instagram
      IG_ROOT_URL: process.env.IG_ROOT_URL,
      IG_USER_ID: process.env.IG_USER_ID,
      IG_LONG_TOKEN: process.env.IG_LONG_TOKEN,
      // oauth
      GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      YAHOO_OAUTH_CLIENT_ID: process.env.YAHOO_OAUTH_CLIENT_ID
    }
  },
  alias: {
    '@/': './'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                  @import "@/assets/scss/variables/colors.scss";
                  @import "@/assets/scss/variables/fonts.scss";
                  @import "@/assets/scss/variables/font-size.scss";
                  @import "@/assets/scss/variables/spacing.scss";
                  @import "@/assets/scss/_css-reset.scss";
                  @import "@/assets/scss/_mixins.scss";
                  @import "@/assets/scss/_stylesheet.scss";
                  @import "@/assets/scss/_animations.scss";
                  @import "@/assets/scss/_layouts.scss";
                  @import "@/assets/scss/buttons/_buttons.scss";
                  @import "@/assets/scss/_inputs.scss";
                  @import "@/assets/scss/_text.scss";
                  @import "@/assets/scss/_backgrounds.scss";
                  @import "@/assets/scss/global.scss";
                  @import "@/assets/scss/effects.scss";
                `
        }
      }
    }
  },
  imports: {
    dirs: ['stores']
  },
  modules: [['@pinia/nuxt', { autoImports: ['defineStore'] }], '@pinia-plugin-persistedstate/nuxt', '@nuxt/image'],
  components: [
    {
      path: '~/components/',
      pathPrefix: false
    }
  ],
  app: {
    head: {
      title: 'Wisdom Music',
      titleTemplate: '%s · Listen what your soul craves',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Wisdom · Listen what your soul craves'
        },
        {
          property: 'og:image',
          content: 'https://valuemycar.fr/images/vmclogo.svg'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900|Nunito:300,400,500,600,700,800,900&display=swap'
        }
      ],
      script: []
    }
  }
})
