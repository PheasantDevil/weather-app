<template>
  <div class="language-switcher">
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="changeLanguage(locale.code)"
    >
      {{ locale.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();

  const locales = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  const changeLanguage = (code: string) => {
    locale.value = code;
  };
</script>

<style scoped>
  .language-switcher button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
