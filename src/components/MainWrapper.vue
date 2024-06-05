<script setup>
// handle theme switch
import {DarkModeOutlined, LightModeOutlined, CloseOutlined, HomeFilled} from "@vicons/material";
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

import {useRouter} from 'vue-router'
const router = useRouter()
const isRouterHome = computed(()=>{
  return router.currentRoute.value.name === 'Home'
})
function handleToHome(){
  router.replace({
    name: 'Home'
  })
  reload()
}
}

import { inject, nextTick, provide } from "vue";
const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(()=> {
    isRouterAlive.value = true
  })
}
provide('reload', reload)
</script>

<template>
<n-layout class="base">
    <n-space id="main-wrapper" vertical>
      <n-space data-tauri-drag-region id="header" justify="space-between">
        <n-button id="btn-home" @click="handleToHome" text v-show="!isRouterHome">
          <template #icon>
            <n-icon><HomeFilled /></n-icon>
          </template>
        </n-button>
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
      <router-view v-if="isRouterAlive" :key="router.currentRoute.value.fullPath"/>
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
  font-size: 24px;
}

#btn-grp {
  margin-right: 16px;
}
#btn-home {
  margin-left: 12px;
}
</style>
