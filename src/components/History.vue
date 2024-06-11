<template>
  <n-empty v-if="!hasHistory" description="暂无历史查询记录" style="margin-bottom: 32px;"></n-empty>
  <n-flex vertical v-if="hasHistory" style="margin-bottom: 16px;">
    <n-scrollbar style="max-height: 300px;">
      <n-list hoverable clickable>
        <n-list-item v-for="item in wordsBrief" @click="handleClick" :key="item.word" :data-key="item.word">
          <n-thing>
            <template #header>
              <n-text strong type="success">{{ item.word }}</n-text>
            </template>
            <template #description>
              <n-text>{{ item.brief }}</n-text>
            </template>
            <n-text :depth="3">{{ getSimpleTime(item.latestTimestamp) }}</n-text>
          </n-thing>
          <template #suffix>
            <n-tag size="small" v-if="item.counts > 1">已查{{ item.counts }}次</n-tag>
          </template>
        </n-list-item>
      </n-list>
    </n-scrollbar>
    <n-flex justify="end" style="margin-top: 12px;">
      <n-button text type="success" style="margin-right: 12px;" @click="clearHistory">清除历史</n-button>
    </n-flex>
  </n-flex>
</template>

<script setup>
import { getQueryHistory, clearQueryHistory } from "@/database/queryHistory.js";
import { getSingleBrief } from '@/api/query.js'
import { ref, onBeforeMount } from "vue";

const queryHistory = ref()
const wordsBrief = ref([])

const hasHistory = ref(false)

onBeforeMount(async () => {
  queryHistory.value = await getQueryHistory()
  console.log(queryHistory.value)
  if (queryHistory.value.length > 0) {
    hasHistory.value = true
    let briefs = queryHistory.value.map(async item => {
      let result = await getSingleBrief(item.word)
      return {
        word: item.word,
        brief: result.data.data.entries[0].explain,
        counts: item.counts,
      }
    })
    wordsBrief.value = await Promise.all(briefs)
  } else {
    hasHistory.value = false
    wordsBrief.value = []
  }
})


import dayjs from 'dayjs'
function getSimpleTime(timeStr) {
  return dayjs(timeStr).format('MM-DD HH:mm')
}


const emits = defineEmits(['closeModal'])

import { useRouter } from 'vue-router'
const router = useRouter()
function handleClick(event) {
  const item = event.target.closest('li')
  const word = item.getAttribute('data-key')
  emits('closeModal')
  router.push({
    name: 'Query',
    query: {
      word
    }
  })
}

function clearHistory() {
  clearQueryHistory()
  hasHistory.value = false
  wordsBrief.value = []
  emits('closeModal')
}
</script>
