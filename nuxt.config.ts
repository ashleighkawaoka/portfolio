export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static'
  },
  css: ['~/assets/styles/global.scss'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/qgr7wto.css'
        }
      ]
    }
  }
})