export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'ja', name: '日本語', iso: 'ja-JP', file: 'ja.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_and_default',
    lazy: true,
  },

  compatibilityDate: '2024-09-13'
})