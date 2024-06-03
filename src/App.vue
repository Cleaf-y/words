<script setup>
import { useConfigStore } from "./stores/config";
import MainWrapper from "@/components/MainWrapper.vue";
const configStore = useConfigStore();
</script>

<template>
  <n-config-provider :theme="configStore.currentTheme">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-modal-provider>
            <n-loading-bar-provider>
              <MainWrapper />
            </n-loading-bar-provider>
          </n-modal-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>

</style>
