<script setup>
import { useConfigStore } from "./stores/config";
import MainWrapper from "@/components/MainWrapper.vue";
const configStore = useConfigStore();

import { ref, onBeforeMount } from "vue";
import { initDatabase } from "@/database/init.js";

const isReady = ref(false);
onBeforeMount(async () => {
  await initDatabase();
  isReady.value = true;
});
</script>

<template>
  <n-spin v-if="!isReady" id="loading" size="large" />
  <n-config-provider :theme="configStore.currentTheme" v-if="isReady">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-loading-bar-provider>
              <MainWrapper class="no-select" />
            </n-loading-bar-provider>
          </n-modal-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
#loading {
  margin-top: 45vh;
  margin-left: 48vw;
}

.no-select {
  -webkit-touch-callout: none;
  /*系统默认菜单被禁用*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -khtml-user-select: none;
  /*早期浏览器*/
  -moz-user-select: none;
  /*火狐*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
  cursor: default;
}
</style>
