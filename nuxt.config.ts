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
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://use.typekit.net' },
        { rel: 'stylesheet', href: 'https://use.typekit.net/yea2wyl.css', media: 'print', onload: "this.media='all'" }
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Ashleigh Kawaoka' }
      ]
    }
  }
})