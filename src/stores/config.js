import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { darkTheme } from "naive-ui";

export const useConfigStore = defineStore("config", () => {
  const appTitle = ref("Words");
  const isDarkTheme = ref(false);

  const currentTheme = computed(() => {
    return isDarkTheme.value ? darkTheme : null;
  });

  function updateTheme() {
    isDarkTheme.value = !isDarkTheme.value;
  }

  return {
    appTitle,
    isDarkTheme,
    updateTheme,
    currentTheme,
  };
});
