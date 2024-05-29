<script setup>
// handle theme switch
import {DarkModeOutlined, LightModeOutlined, CloseOutlined} from "@vicons/material";
import { useConfigStore } from "../stores/config";
const configStore = useConfigStore();

// handle Exit button click
import {useDialog} from "naive-ui";
import {appWindow} from "@tauri-apps/api/window"
const dialog = useDialog();
function exitApp(){
  dialog.info({
    title: '退出',
    content: '确定要退出吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: ()=>{
      appWindow.close()
    }
  })
}
</script>

<template>
<n-layout class="base">
    <n-space id="main-wrapper" vertical>
      <n-space data-tauri-drag-region id="header" justify="space-between">
        <n-button>LOGO</n-button>
        <n-space id="btn-grp">
          <n-button text @click="configStore.updateTheme">
            <template v-if="!configStore.isDarkTheme" #icon>
              <n-icon><DarkModeOutlined /></n-icon>
            </template>
            <template v-if="configStore.isDarkTheme" #icon>
              <n-icon><LightModeOutlined /></n-icon>
            </template>
          </n-button>
          <n-button @click="exitApp" text><template #icon><n-icon><CloseOutlined /></n-icon></template></n-button>
        </n-space>
      </n-space>
      <router-view />
    </n-space>
</n-layout>
</template>

<style lang="scss" scoped>
.base {
  width: 100vw;
  height: 100vh;
}

#header {
  padding: 16px;
}

#btn-grp {
  font-size: 24px;
  margin-right: 16px;
}
</style>
