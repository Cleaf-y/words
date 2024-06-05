<script setup>
import { useConfigStore } from "./stores/config";
import MainWrapper from "@/components/MainWrapper.vue";
const configStore = useConfigStore();


import {ref, onBeforeMount} from 'vue'
import {initDatabase} from "@/database/init.js";

const isReady = ref(false)
onBeforeMount(async ()=>{
  await initDatabase()
  isReady.value = true
})
</script>

<template>
  <n-config-provider :theme="configStore.currentTheme" v-if="isReady">
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
