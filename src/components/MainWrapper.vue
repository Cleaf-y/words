<script setup>
// handle theme switch
import { DarkModeOutlined, LightModeOutlined, CloseOutlined, HomeFilled, HistoryOutlined, ListAltOutlined, SettingsOutlined, ArrowBackOutlined } from "@vicons/material";
import { useConfigStore } from "../stores/config";
const configStore = useConfigStore();

// handle Exit button click
import { useDialog } from "naive-ui";
import { appWindow } from "@tauri-apps/api/window"
const dialog = useDialog();
function exitApp() {
  dialog.info({
    title: '退出',
    content: '确定要退出吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      appWindow.close()
    }
  })
}

import { useRouter } from 'vue-router'
const router = useRouter()
const isRouterHome = computed(() => {
  return router.currentRoute.value.name === 'Home'
})
function handleToHome() {
  router.replace({
    name: 'Home'
  })
  // reload()
}
function handleToBack() {
  router.back()
}
function handleNavigateTo(name) {
  router.push({
    name
  })
}

import { inject, nextTick, provide } from "vue";
const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('reload', reload)

import History from '@/components/History.vue'
const isShowHistoryModal = ref(false)
function showHistoryModal() {
  isShowHistoryModal.value = true
}

function onRedirected() {
  isShowHistoryModal.value = false
}

</script>

<template>
<n-layout class="base">
  <n-modal v-model:show="isShowHistoryModal" preset="card" style="width: 80vw;" size="small">
    <History @closeModal="onRedirected" />
  </n-modal>
  <n-layout class="base no-select">
    <n-space id="main-wrapper" vertical>
      <n-space data-tauri-drag-region id="header" justify="space-between">
        <n-space id="btn-grp-left">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button id="btn-home" @click="handleToHome" text v-show="!isRouterHome">
                <template #icon>
                  <n-icon>
                    <HomeFilled />
                  </n-icon>
                </template>
              </n-button>
            </template>
            返回主页
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="handleToBack" text v-show="!isRouterHome">
                <template #icon>
                  <n-icon>
                    <ArrowBackOutlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
            返回上一页
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text v-show="isRouterHome" @click="showHistoryModal">
                <n-icon :size="20">
                  <HistoryOutlined />
                </n-icon>
              </n-button>
            </template>
            历史记录
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="handleNavigateTo('WordsBook')" text v-show="isRouterHome">
                <n-icon :size="20">
                  <ListAltOutlined />
                </n-icon>
              </n-button>
            </template>
            单词本
          </n-tooltip>
        </n-space>
        <n-space id="btn-grp" class="no-select">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text @click="configStore.updateTheme">
                <template v-if="!configStore.isDarkTheme" #icon>
                  <n-icon>
                    <DarkModeOutlined />
                  </n-icon>
                </template>
                <template v-if="configStore.isDarkTheme" #icon>
                  <n-icon>
                    <LightModeOutlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
            切换主题
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="exitApp" text><template #icon><n-icon>
                    <CloseOutlined />
                  </n-icon></template></n-button>
            </template>
            退出
          </n-tooltip>
        </n-space>
      </n-space>
      <router-view v-if="isRouterAlive" :key="router.currentRoute.value.fullPath" />
      <n-space v-if="isRouterHome" id="footer" justify="start">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button text @click="handleNavigateTo('Settings')"><n-icon :size="18">
                <SettingsOutlined />
              </n-icon></n-button>
          </template>
          设置
        </n-tooltip>
      </n-space>
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

#footer {
  position: absolute;
  bottom: 24px;
  margin-left: 32px;
  margin-top: 16px;
}
</style>
