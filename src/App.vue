<script setup>
import { useConfigStore } from "./stores/config";
const configStore = useConfigStore();
</script>

<template>
  <n-config-provider :theme="configStore.currentTheme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-layout class="base">
              <router-view></router-view>
            </n-layout>
          </n-modal-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
.base {
  height: 100vh;
  width: 100vw;
  padding: 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
}
</style>
